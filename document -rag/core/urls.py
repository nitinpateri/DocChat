from django.urls import path
from .views import DocumentUploadView, AskQuestionView, DocumentListView, DocumentDetailView

urlpatterns = [
    path('upload/', DocumentUploadView.as_view(), name='document-upload'),
    path('ask/', AskQuestionView.as_view()),
    path('documents/', DocumentListView.as_view()),
    path('documents/<int:pk>/', DocumentDetailView.as_view(), name='document-detail'),
]
