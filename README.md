# create-nodew-exe

Create an executable based on node.exe that will not show 
a terminal on launch.

###Usage
```
# default: node . node.exe nodew.exe
node . [<path to node.exe>] [<path to nodew.exe>]
```

The modified executable will be created in the location from which
you are calling this script. 

### Testing the executable
- Start -> Run...
- <path to new .exe> test.js 

Calculator should start with no terminal window being visible.

### Debug output

By using e.g.:

`DEBUG=create-nodew-exe` 

Although there really isn't much debug output...
