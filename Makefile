CLICKABLE := $(PROJECTS)/featurefork/clickable/clickable-dev


.PHONY: all
.DEFAULT: all
all: build

.PHONY: build
build:
	$(CLICKABLE) build
	$(CLICKABLE) click-build

platforms/ubuntu/ubuntu-sdk-16.04/armhf/prefix/librifox.mjsir911_1.0.3_armhf.click: build

.PHONY: install
install: platforms/ubuntu/ubuntu-sdk-16.04/armhf/prefix/librifox.mjsir911_1.0.3_armhf.click
	$(CLICKABLE) install

.PHONY: test
test: install
	$(CLICKABLE) launch

RM += -r
.PHONY: clean
clean: 
	$(RM) plugins platforms node_modules package-lock.json
