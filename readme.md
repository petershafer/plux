## Plux is Peter's Flux implementation

If you'd like to try out the demo, follow these steps.

1. npm install
2. npm start
3. open your browser to http://localhost:3000/demo

### What is Plux?

As I've been learning about the [Flux architecture](https://github.com/facebook/flux) I've been trying to build my own proof of concept.  Flux is a pattern for application architectures and there are Flux implementations that are becoming more popular, like [Redux](https://github.com/reactjs/redux).  However, it's not as though Redux is the be-all and end-all of Flux. It requires some very specific trade-offs to be made for it to be properly leveraged. To be able to know whether or not these trade-offs are acceptable, you need to have a solid grasp of vanilla flux. 

So, Plux is my effort at learning how Flux works and the pros and cons of different tradeoffs you can make while using Flux.  Where a framework like Redux will allow you to have perfect playback and capture of an app's state, Plux offers flexibility to gradually ease into the Flux pattern. [You may not need advanced features of Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367) but you'll still want the benefits that Flux has to offer.

You can follow the `proof-of-concept` branch to see how Plux is implemented directly in the browser, without any tools or libraries. React is not required, and really it is not a prerequisite for any application using the Flux pattern.

Plux may never be released for general usage, but you can feel free to use the code in your own applications and tweak it to suit your purposes.

**Shout out** to @n1207n for patiently helping me get started with Flux.