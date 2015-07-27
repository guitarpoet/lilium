################################################################################
# 
# The Makefile For Building Lilium
# 
# @author Jack
# @version 1.0
# @date Thu Jun 25 18:44:08 2015
#
# Tasks:
# 	- clean: Clean the build
# 	- compile: Compile the source code
# 	- compile_test: Compile the test source code
# 	- test: Run the test using jasmine (yes, you must have jasmine installed)
# 	- build: Same as compile
#   - all: Same as compile compile_test then test, this is the default one
#
################################################################################

#===============================================================================
#
# Functions
#
#===============================================================================

rwildcard=$(foreach d,$(wildcard $1*),$(call rwildcard,$d/,$2) $(filter $(subst *,%,$2),$d))

#===============================================================================
#
# Variables
#
#===============================================================================

ifdef DEBUG
	SILENT := 
else
	SILENT := @
endif

BABEL := babel
SPEC_DIR := spec
ECHO := echo
RM := rm -rf
CP := cp
CD := cd
MKDIR := mkdir -p
JASMINE := jasmine
DIST_DIR := dist
CLIPS_HOME ?= /opt/local/src/clips-tool

#===============================================================================
#
# Files
#
#===============================================================================
CORE_DIR := src/core
DS_DIR := src/ds
CORE_FILES_PATTERN := src/core/*.jsx
CORE_FILES := $(wildcard $(CORE_FILES_PATTERN))
DS_FILES_PATTERN := src/ds/*.jsx
DS_FILES := $(wildcard $(DS_FILES_PATTERN))
DIST_FILES := $(SPEC_DIR)/core.js ${SPEC_DIR}/ds.js
LILIUM := $(DIST_DIR)/lilium.js
TEST_FILES := $(call rwildcard, tests, *.jsx)
TEST_DIST_FILES := $(foreach f, $(TEST_FILES:jsx=js), $(SPEC_DIR)/$(f))
TEST_MAP_FILES := $(foreach f, $(TEST_FILES:jsx=js.map), $(SPEC_DIR)/$(f))

#===============================================================================
#
# Patterns
#
#===============================================================================

$(SPEC_DIR)/%_spec.js.map : %_spec.jsx
	$(SILENT) $(BABEL) -d $(SPEC_DIR) -s $@ $<

#===============================================================================
#
# Tasks
#
#===============================================================================

all: build test

build: compile

dist: build
	$(RM) $(CLIPS_HOME)/src/Clips/Widgets/Lilium/js/
	$(CP) -rf $(DIST_DIR) $(CLIPS_HOME)/src/Clips/Widgets/Lilium/js/

$(LILIUM): $(CORE_FILES) $(DS_FILES)
	@$(ECHO) "Recreating dist directory"
	$(SILENT) $(RM) $(DIST_DIR)
	$(SILENT) $(MKDIR) $(DIST_DIR)
	@$(ECHO) "Copying files"
	$(SILENT) $(CP) -r $(CORE_DIR) $(DIST_DIR)
	$(SILENT) $(CP) -r $(DS_DIR) $(DIST_DIR)
	@$(ECHO) "Compiling Lilium."
	$(SILENT) $(BABEL) -o $(LILIUM) -s $(DIST_DIR)/lilium.js.map $(DIST_DIR)/core/*.jsx $(DIST_DIR)/ds/*.jsx
	@$(ECHO) "Compiled."

compile: $(DIST_FILES) $(LILIUM)

clean: 
	@$(ECHO) "Cleaning..."
	$(SILENT) $(RM) $(SPEC_DIR)/*.js $(SPEC_DIR)/*.map $(SPEC_DIR)/tests
	@$(ECHO) "Done."

test: compile $(TEST_MAP_FILES)
	@$(JASMINE)

$(SPEC_DIR)/core.js: $(CORE_FILES)
	@$(ECHO) "Compiling Core..."
	$(SILENT) $(BABEL) -o $(SPEC_DIR)/core.js -s $(SPEC_DIR)/core.js.map $(CORE_FILES)
	@$(ECHO) "Done."

$(SPEC_DIR)/ds.js: $(DS_FILES)
	@$(ECHO) "Compiling DataStore..."
	$(SILENT) $(BABEL) -o $(SPEC_DIR)/ds.js -s $(SPEC_DIR)/ds.js.map $(DS_FILES)
	@$(ECHO) "Done."

.PHONY: all clean test compile build dist
