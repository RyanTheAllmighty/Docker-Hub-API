# Style Guide
This is a simple style guide of how I style and present my code (at least try to).

# Coding Standards
+ All line lengths must be kept less than 200 characters and use 4 spaces rather than tab characters.
+ All JSON documents should use 4 space indentation.
+ Don't do large code commits. My preference is a single commit for a single fix/addition rather than bundled up commits.
+ Document appropriately. While there is no need to put single line comments in for everything, having doc blocks and comments where necessary helps others see what the code does.
+ Make sure all code adheres to the provided JSHint and JSCS standards. Running 'gulp style' will run both checkers and check for any issues
+ Increment the version in the package.json before the last commit before release. Nothing worse than having to question if it's already been incremented or not

# Classes
Since this application is using ECMAScript 6, we have access to classes.

Classes should always use Symbols to hide the original data so it cannot be accessed with appropriate getters and setters.

Immediately in the body of the class should be the constructor followed by any getter/setter methods (using the get/set keyword) and then followed by any other methods of the class.

Lastly any callbacks used internally by the class should be referenced at the bottom of the file (outside of the class) for JSDoc purposes.

# Requires
When using the require syntax in js files, all require statements should be at the top of the file, under the license declaration and strict statement.

When using modules from different methods, they should be separated out into groups, with the applications internal modules first, then any application internal classes and then finally any external modules.

All require groups should be sorted by length with the shortest statement at the top and the longest at the bottom. In the case of a tie, it should be in alphabetical order by the variables name.

# Styling Guidelines
For details on JSDoc used for all JavaScript files, see [this website](http://usejsdoc.org/).

+ Make sure all doc block information has a period at the end.
+ Make sure all doc block @ elements don't have a period at the end.
+ Make sure all type declarations use the Type definitions. For instance {String} instead of {string}.
+ Make sure all comments after the - in @ doc block elements start with a lowercase
+ Make sure all comments not in doc blocks don't end in a period.
+ Make sure there is a blank line between any main doc block information and any @elements.
+ Make sure all callbacks are documented at the very bottom of the file.
+ Make sure all JS files included with script tags are wrapped in IIFE's.
+ Make sure there are no multi line variables. All variables should be declared one per line with no multi line declarations.
+ Make sure to use let instead of var wherever possible.
+ When needing to access this in a callback of a method, the variable to store this should be called self. For example (let self = this;).
+ All files should be saved with lowercamelCase names.
+ All classes should be UpperCamelCase with no spaces or other non alphanumeric characters.

## Example
    // Some comment. Which doesn't end in a period

    /**
     * Where the magic happens. Notice I end in a period.
     *
     * @param {String} arguments - lower case start. All the arguments passed in from the command line, notice I don't end in a period
     */