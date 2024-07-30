from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from .views import home, login, signup, chatbot, datapost,dataposter,logout,login_error,about

urlpatterns = [
    path('', home, name='home-page'),
    path('login/', login, name='login'),
    path('sign-up/', signup, name='sign-up'),
    path('post/', datapost, name='post'),
    path('chatbot/<str:type>/',chatbot,name="chatbot"),
    path('chatbot/<str:type>/datapost/',dataposter,name="data"),
    path('logout',logout,name="logout"),
    path('login/error/', login_error, name='login_error'),
    path('about/', about, name='about'),
]
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
