from django.shortcuts import render
from rest_framework.generics import ListAPIView, DestroyAPIView, RetrieveAPIView, RetrieveDestroyAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import DocumentUploadSerializer
from .utils import extract_text, chunk_text, store_embeddings,ask_question
from .models import Document,DocumentChunk, ChatSession, ChatMessage
import os

class DocumentUploadView(APIView):
    def post(self, request):
        print("📥 Incoming data:", request.data)
        serializer = DocumentUploadSerializer(data=request.data)
        if serializer.is_valid():
            doc = serializer.save()
            # 📄 Extract + chunk
            file_path = doc.file.path
            text = extract_text(file_path, doc.file_type)
            chunks = chunk_text(text)

            # Store in DB
            chunk_objs = []
            for i, chunk in enumerate(chunks):
                chunk_objs.append(DocumentChunk(
                    document=doc,
                    chunk_index=i,
                    page_number=0,
                    text=chunk
                ))
            DocumentChunk.objects.bulk_create(chunk_objs)

            # Generate and store embeddings
            embedding_ids = store_embeddings(doc.id, chunks)

            # Update each chunk with its embedding ID
            for chunk_obj, emb_id in zip(DocumentChunk.objects.filter(document=doc), embedding_ids):
                chunk_obj.embedding_id = emb_id
                chunk_obj.save()
            return Response(DocumentUploadSerializer(doc).data, status=status.HTTP_201_CREATED)
        print("❌ Validation Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AskQuestionView(APIView):
    def post(self, request):
        document_id = request.data.get("document_id")
        question = request.data.get("question")
        session_id = request.data.get("session_id")

        if not document_id or not question:
            return Response({"error": "Missing document_id or question"}, status=400)

        try:
            document = Document.objects.get(id=document_id)
        except Document.DoesNotExist:
            return Response({"error": "Document not found"}, status=404)

        answer, chunks = ask_question(document_id, question)

        # Optional: Save chat session
        if session_id:
            session = ChatSession.objects.get(id=session_id)
        else:
            session = ChatSession.objects.create(document=document)

        msg = ChatMessage.objects.create(
            chat_session=session,
            document=document,
            question=question,
            answer=answer,
            source_chunks=chunks
        )

        return Response({
            "answer": answer,
            "chunks": chunks,
            "chat_session_id": session.id,
            "message_id": msg.id
        })
        
        
class DocumentListView(ListAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentUploadSerializer
    


class DocumentDetailView(RetrieveDestroyAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentUploadSerializer