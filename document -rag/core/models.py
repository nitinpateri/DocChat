from django.db import models

class Document(models.Model):
    title = models.CharField(max_length=255,blank=True)
    file = models.FileField(upload_to='documents/')
    file_type = models.CharField(max_length=10)
    size = models.IntegerField()
    pages = models.IntegerField(default=0)
    processing_status = models.CharField(max_length=20, default='pending')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class DocumentChunk(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='chunks')
    chunk_index = models.IntegerField()
    page_number = models.IntegerField()
    text = models.TextField()
    embedding_id = models.CharField(max_length=255)

class ChatSession(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class ChatMessage(models.Model):
    chat_session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, null=True, blank=True)
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    question = models.TextField()
    answer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    source_chunks = models.JSONField(default=list)  # store list of chunk IDs or text
