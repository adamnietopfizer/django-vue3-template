# Django + Vue 3 + Heroku Template (Oct 2020)

Simplest way to deploy a webapp with backend and dedicated frontend to Heroku.

__Forked from [https://github.com/gtalarico/django-vue-template](https://github.com/gtalarico/django-vue-template).__

Changes to the original template:

- Vue 3 + TypeScript + TailwindCSS in separate [frontend](./frontend) directory
- Does not require Pipenv
- More detailed instructions for deploying to Heroku

Out of the box, Django will serve the application entry point (`index.html` + bundled assets) at `/` ,
data at `/api/`, and static files at `/static/`. Django admin panel is also available at `/admin/` and can be extended as needed.

### Features

- [Django](https://www.djangoproject.com/) backend
- [Whitenoise](http://whitenoise.evans.io/en/stable/) for serving static assets, CDN Ready
- [Vue 3](https://vuejs.org/) frontend with TypeScript, Vue Router, Vuex, and TailwindCSS
- [Gunicorn](https://gunicorn.org/) as HTTP server
- Configuration for Heroku Deployment


### Known issues

- [ ] Unit tests don't work yet in Vue 3
- [ ] No `pytest` tests yet in Django
- [ ] Get rid of Django REST framework (?)

### Template Structure

| Location       | Content                                                 |
| -------------- | ------------------------------------------------------- |
| `/backend`     | Django Project & Backend Config                         |
| `/backend/api` | Django App (`/api`)                                     |
| `/frontend`    | Vue 3 TypeScript App                                    |
| `/dist/`       | Bundled Assets Output (generated at `yarn` in the root) |

## Prerequisites

Before getting started you should have the following installed and running:

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/en/docs/install)
- [Python 3](https://wiki.python.org/moin/BeginnersGuide) + [virtual environment](https://docs.python.org/3/library/venv.html)

## Setup

```bash
$ git clone https://github.com/ksaaskil/django-vue3-template
$ cd django-vue3-template
```

Install dependencies:

```bash
$ yarn install
$ pip install -r requirements.txt
$ python manage.py migrate  # Prepare local Django database
```

## Running Development Servers

Start the Django backend:

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

```bash
$ yarn  # Builds a dist/ folder at the root of the repository
$ python manage.py runserver
```

## Deploy

- Set `ALLOWED_HOSTS` on [`backend.settings.prod`](/backend/settings/prod.py)

### Deploy to Heroku

Sign up at [Heroku](https://www.heroku.com/), install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) and run the following commands at the root of the repository:

```bash
$ heroku login  # If you haven't logged in yet in the CLI
$ heroku create your-app-name
$ git remote -v  # Note how a git remote 'heroku' was created
$ heroku buildpacks:add --index 1 heroku/nodejs  # For building Vue app
$ heroku buildpacks:add --index 2 heroku/python  # For building Django app
$ heroku addons:create heroku-postgresql:hobby-dev  # Use Heroku's Postgres DB, requires adding payment details in Heroku
$ heroku config:set DJANGO_SETTINGS_MODULE=backend.settings.prod  # Use persistent database, set Debug=False, etc.
$ heroku config:set DJANGO_SECRET_KEY='...(your django SECRET_KEY value)...'  # For Django's cryptographic signing 
$ heroku config:set YARN_PRODUCTION=false  # Building Vue app requires Vue CLI service which is a dev dependency
$ heroku config:set DATABASE_URL=''  # If using database outside of Heroku
$ git push heroku  # Deploy to Heroku
```

Heroku's [Node.js buildpack](https://devcenter.heroku.com/articles/nodejs-support) will build the frontend via the auxiliary [`package.json`](/package.json) file.
Running `install` triggers a command that calls `yarn install` and `yarn build` in the `frontend` directory.
This will create the bundled `dist` folder at the root of the repository, which is served by whitenoise in Django.

The [Python buildpack](https://devcenter.heroku.com/articles/python-support) will detect the [`requirements.txt`](/requirements.txt) and install all the Python dependencies.

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
