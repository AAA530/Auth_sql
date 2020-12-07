build:
	cd Backend && $(MAKE) build
	cd Frontend && $(MAKE) build

run:
	docker-compose up

stop:
	docker-compose down