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

BABEL=babel
SPEC_DIR=spec
ECHO=echo
RM=rm -rf
JASMINE=jasmine

#===============================================================================
#
# Files
#
#===============================================================================
CORE_FILES=$(wildcard src/core/*.jsx)
DS_FILES=$(wildcard src/ds/*.jsx)
DIST_FILES= ${SPEC_DIR}/core.js ${SPEC_DIR}/ds.js
TEST_FILES=$(call rwildcard, tests, *.jsx)
TEST_DIST_FILES=$(foreach f, ${TEST_FILES:jsx=js}, ${SPEC_DIR}/${f})
TEST_MAP_FILES=$(foreach f, ${TEST_FILES:jsx=js.map}, ${SPEC_DIR}/${f})

#===============================================================================
#
# Patterns
#
#===============================================================================

${SPEC_DIR}/%_spec.js.map : %_spec.jsx
	@${BABEL} -d ${SPEC_DIR} -s $@ $<

#===============================================================================
#
# Tasks
#
#===============================================================================

all: test

compile: ${DIST_FILES}
	@${ECHO} "Compiled."

clean: 
	@${ECHO} "Cleaning..."
	@${RM} ${SPEC_DIR}/*.js ${SPEC_DIR}/*.map ${SPEC_DIR}/tests
	@${ECHO} "Done."

test: compile ${TEST_MAP_FILES}
	@${JASMINE}

${SPEC_DIR}/core.js: ${CORE_FILES}
	@${ECHO} "Compiling Core..."
	@${BABEL} -o ${SPEC_DIR}/core.js -s ${SPEC_DIR}/core.js.map ${CORE_FILES}
	@${ECHO} "Done."

${SPEC_DIR}/ds.js: ${DS_FILES}
	@${ECHO} "Compiling DataStore..."
	@${BABEL} -o ${SPEC_DIR}/ds.js -s ${SPEC_DIR}/ds.js.map ${DS_FILES}
	@${ECHO} "Done."

.PHONY: all clean test compile
