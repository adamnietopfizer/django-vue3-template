# Modern Django Vue 3 Template (Oct 2020)

_Forked from [https://github.com/gtalarico/django-vue-template](https://github.com/gtalarico/django-vue-template)._

Changes to original:

- Vue 3 in separate _frontend/_ directory
- Updated dependencies
- Do not require Pipenv

Out of the box, Django will serve the application entry point (`index.html` + bundled assets) at `/` ,
data at `/api/`, and static files at `/static/`. Django admin panel is also available at `/admin/` and can be extended as needed.

### Includes

- Django
- Django REST framework
- Django Whitenoise, CDN Ready
- Vue 3 project with TypeScript and Vue Router
- Gunicorn
- Configuration for Heroku Deployment

### Template Structure

| Location       | Content                                                 |
| -------------- | ------------------------------------------------------- |
| `/backend`     | Django Project & Backend Config                         |
| `/backend/api` | Django App (`/api`)                                     |
| `/frontend`    | Vue 3 TypeScript App                                    |
| `/dist/`       | Bundled Assets Output (generated at `yarn` in the root) |

## Prerequisites

Before getting started you should have the following installed and running:

- [x] Yarn - [instructions](https://yarnpkg.com/en/docs/install)
- [x] Python 3 - [instructions](https://wiki.python.org/moin/BeginnersGuide)

## Setup Template

```
$ git clone https://github.com/ksaaskil/django-vue3-template
$ cd django-vue3-template
```

Setup

```bash
$ yarn install
# Create virtual environment before the next command
$ pip install -r requirements.txt
$ python manage.py migrate
```

## Running Development Servers

Start the backend:

```bash
$ python manage.py runserver
```

Start the frontend:

```bash
$ cd frontend
$ yarn serve
```

The Vue application will be served from [`localhost:8080`](http://localhost:8080/) and the Django API
and static files will be served from [`localhost:8000`](http://localhost:8000/).

The dual dev server setup allows you to take advantage of
webpack's development server with hot module replacement.
Proxy config in [`frontend/vue.config.js`](/frontend/vue.config.js) is used to route the requests
back to django's API on port 8000.

If you would rather run a single dev server, you can run Django's
development server only on `:8000`, but you have to build the Vue app first (`yarn`)
and the page will not reload on changes.

```
$ yarn
$ python manage.py runserver
```

## Deploy

- Set `ALLOWED_HOSTS` on [`backend.settings.prod`](/backend/settings/prod.py)

### Deploy to Heroku

```
$ heroku create your-app-name
$ git remote -v  # Check your git remotes for heroku
$ heroku buildpacks:add --index 1 heroku/nodejs
$ heroku buildpacks:add --index 2 heroku/python
$ heroku addons:create heroku-postgresql:hobby-dev
$ heroku config:set DJANGO_SETTINGS_MODULE=backend.settings.prod
$ heroku config:set DJANGO_SECRET_KEY='...(your django SECRET_KEY value)...'
$ heroku config:set YARN_PRODUCTION=false  # Building dist/ requires Vue CLI service
$ heroku config:set DATABASE_URL=''  # If using database outside Heroku
$ git push heroku
```

Heroku's nodejs buildpack will build the frontend via the auxiliary [`package.json`](/package.json) file.
It will then trigger a command which calls `yarn build` in the frontend.
This will create the bundled `dist` folder which will be served by whitenoise.

The python buildpack will detect the [`requirements.txt`](/requirements.txt) and install all the python dependencies.

The [`Procfile`](/Procfile) will run Django migrations and then launch Django app using gunicorn.

## Static Assets

See `settings.dev` and [`vue.config.js`](/frontend/vue.config.js) for notes on static assets strategy.

This template implements the approach suggested by Whitenoise Django.
For more details see [WhiteNoise Documentation](http://whitenoise.evans.io/en/stable/django.html)

It uses Django Whitenoise to serve all static files and Vue bundled files at `/static/`.
While it might seem inefficient, the issue is immediately solved by adding a CDN
with Cloudfront or similar.
Use [`vue.config.js`](/vue.config.js) > `baseUrl` option to set point all your assets to the CDN,
and then set your CDN's origin back to your domains `/static` url.

Whitenoise will serve static files to your CDN once, but then those assets are cached
and served directly by the CDN.

This allows for an extremely simple setup without the need for a separate static server.

[Cloudfront Setup Wiki](https://github.com/gtalarico/django-vue-template/wiki/Setup-CDN-on-Cloud-Front)
