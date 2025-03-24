# 🏰 Full Implementation of Multitenancy in Django

This implementation ensures that each tenant (client) has its own configurations, styles, and features, using a **middleware-based** approach.

## 1️⃣ Define the `Tenant` Model
We create a `Tenant` model to store the configuration for each client, including their domain, theme settings, and enabled features.

```python
from django.db import models

class Tenant(models.Model):
    name = models.CharField(max_length=100)
    domain = models.CharField(max_length=100, unique=True)
    theme_settings = models.JSONField(default=dict)  # Stores UI configurations
    enabled_features = models.JSONField(default=dict)  # Stores feature toggles

    def __str__(self):
        return self.name
```

### 📌 Explanation:
- Each tenant has a **unique domain**.
- `theme_settings` allows **dynamic UI changes** (e.g., colors, fonts).
- `enabled_features` is used to **enable or disable features per client**.

---

## 2️⃣ Create a Middleware to Detect Tenants
Middleware automatically detects which tenant is making a request based on the domain.

```python
from django.utils.deprecation import MiddlewareMixin
from django.http import HttpResponseNotFound
from .models import Tenant

class TenantMiddleware(MiddlewareMixin):
    def process_request(self, request):
        hostname = request.get_host().split(':')[0]  # Extracts the domain
        try:
            tenant = Tenant.objects.get(domain=hostname)
            request.tenant = tenant
        except Tenant.DoesNotExist:
            return HttpResponseNotFound("Tenant not found")  # Return 404 if tenant is missing
```

### 📌 Explanation:
- The middleware retrieves the **tenant based on the request’s domain**.
- If the tenant is found, it is **attached to the request object**.
- If not found, a `404 Not Found` response is returned.

---

## 3️⃣ Register Middleware in `settings.py`
To activate the middleware, add it to the `MIDDLEWARE` list:

```python
MIDDLEWARE = [
    'myapp.middleware.TenantMiddleware',  # Add the Tenant Middleware
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

---

## 4️⃣ Context Processor for Templates
This allows templates to access tenant-specific configurations.

```python
def tenant_context(request):
    if hasattr(request, 'tenant') and request.tenant:
        return {
            'tenant': request.tenant,
            'tenant_theme': request.tenant.theme_settings,
            'tenant_features': request.tenant.enabled_features
        }
    return {}
```

### 📌 Explanation:
- This function **injects** tenant data into Django templates.
- You must **register** it in `TEMPLATES` inside `settings.py`:

```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / "templates"],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'myapp.context_processors.tenant_context',  # Register the processor
            ],
        },
    },
]
```

---

## 5️⃣ Custom Template Tag for Dynamic Settings
If you need to retrieve settings dynamically inside templates, create a custom template tag.

```python
from django import template

register = template.Library()

@register.simple_tag(takes_context=True)
def get_tenant_setting(context, key, default=None):
    request = context['request']
    tenant = getattr(request, 'tenant', None)
    if tenant:
        return tenant.theme_settings.get(key, default)
    return default
```

**Usage in Templates:**
```html
{% load tenant_tags %}
<button class="bg-{% get_tenant_setting 'primary_color' 'blue-500' %} text-white p-2 rounded">
    Submit
</button>
```

---

## 6️⃣ Sample Tenant-based Template
Here’s how you can use the tenant settings dynamically inside your templates.

```html
<!DOCTYPE html>
<html>
<head>
    <title>{{ tenant.name }} - Application</title>
    <meta name="theme-color" content="{{ tenant_theme.primary_color|default:'#3B82F6' }}">
    <link href="/static/css/tailwind.css" rel="stylesheet">
</head>
<body class="{{ tenant_theme.body_class|default:'bg-gray-100' }}">
    <h1 class="text-2xl font-bold text-{% get_tenant_setting 'header_color' 'gray-800' %}">
        Welcome to {{ tenant.name }}
    </h1>

    <button class="bg-{% get_tenant_setting 'primary_color' 'blue-500' %} text-white p-2 rounded">
        Submit
    </button>
</body>
</html>
```

### 📌 Explanation:
- Dynamically **injects the tenant’s primary color** into the Tailwind classes.
- Uses `{{ tenant.name }}` to personalize the site for each client.

---

## 7️⃣ Creating and Managing Tenants
To add new tenants, you can use the Django Admin or manually create them via the shell:

```python
from myapp.models import Tenant

Tenant.objects.create(
    name="Client A",
    domain="clienta.example.com",
    theme_settings={
        "primary_color": "blue-600",
        "body_class": "bg-gray-50",
        "header_color": "blue-800"
    },
    enabled_features={
        "live_chat": True,
        "analytics": False
    }
)
```

---

## 8️⃣ Tenant-based Authentication (Optional)
If you want **separate users per tenant**, extend the `User` model.

```python
from django.contrib.auth.models import AbstractUser
from django.db import models

class TenantUser(AbstractUser):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)  # Users belong to a tenant
```

### 📌 Explanation:
- This ensures that users are **isolated per tenant**.

---

## 🚀 Additional Considerations
✅ **Caching** → Use Redis to cache tenant settings for performance.  
✅ **Multi-DB Setup** → Use `DATABASE_ROUTERS` for **database per tenant** (Django-Tenants).  
✅ **API Support** → If using Django REST Framework, inject the tenant in the `ViewSet`.  
✅ **Subdomain Tenants** → Instead of `domain`, detect tenants using subdomains (`clientA.yourapp.com`).  

---

## 💡 Final Thoughts
This **middleware-based approach** is lightweight and flexible for **small to medium** SaaS applications. For larger systems, consider **Django-Tenants** (PostgreSQL schemas).
