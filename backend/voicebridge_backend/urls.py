from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

from core.views import (
    register,
    login,
    AudioRecordViewSet,
    AISummaryView,
    AgentView
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/agent/", AgentView.as_view(), name="agent"),

    path("api/register/", register, name="register"),
    path("api/login/", login, name="login"),

    path(
        "api/token/",
        TokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        "api/token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    path(
        "api/ai/summary/",
        AISummaryView.as_view(),
        name="ai-summary",
    ),

    path(
        "api/schema/",
        SpectacularAPIView.as_view(),
        name="schema",
    ),
    path(
        "api/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
]

router = DefaultRouter()
router.register(r"audio-records", AudioRecordViewSet)

urlpatterns += router.urls

