CLICKABLE := $(PROJECTS)/featurefork/clickable/clickable-dev


.PHONY: all
.DEFAULT: all
all: build

.PHONY: build
build:
	$(CLICKABLE) build
	$(CLICKABLE) click-build

.PHONY: install
install:
	$(CLICKABLE) install

RM += -r
.PHONY: clean
clean: 
	$(RM) plugins platforms node_modules
