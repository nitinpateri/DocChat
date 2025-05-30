from rest_framework import serializers
from .models import Document


class DocumentUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'title', 'file', 'file_type', 'size', 'pages', 'processing_status', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at', 'processing_status', 'pages', 'size', 'file_type', 'title']

    def create(self, validated_data):
        file = validated_data['file']
        validated_data['title'] = file.name  # dynamically generate title
        validated_data['size'] = file.size
        validated_data['file_type'] = file.name.split('.')[-1].lower()
        return super().create(validated_data)
