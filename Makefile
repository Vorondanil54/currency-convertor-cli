install:
	npm ci

compile:
	npm link

lint:
	npx eslint .

fix:
	npx eslint --fix .
