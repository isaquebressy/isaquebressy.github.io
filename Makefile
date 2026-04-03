# Site Jekyll (github-pages). Primeira vez: make install
.PHONY: install run

install:
	bundle install

run:
	bundle exec jekyll serve --drafts
