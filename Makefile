install:
	npm ci

publish:
	npm publish --dry-run

compile:
	npm link

lint:
	npx eslint .

fix:
	npx eslint --fix .