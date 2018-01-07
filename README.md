# norse-corp-clone

This repo contains a simple clone of the [Norse Corp cyber attacks world map](http://map.norsecorp.com) using mock data.
Created to try out some [D3](https://d3js.org/) features with [socket.io](https://socket.io/).

The biggest challenge was animating the arrows that shoot from point A to point B. That can be done be calculating
the unit vector of the vector between the points, give it some length and then transition it from the origin towards
the destination.

Has only been tested on Chrome and loads client libraries via a CDN for the sake of simplicity.

Usage
---------------
```bash
# Clone the repo
git clone git@github.com:eysi09/norse-corp-clone.git

# Change directory
cd norse-corp-clone

# Install dependencies (can also use yarn install)
npm install

# Then simply start your app (can also use yarn start)
npm start
```

TODO
---------------
+ Fix arrows not shooting the shortest direction bewteen point A and B but sometimes across the entire map.
+ Shorter arrows for points right next to each other.
+ Animations could look more like the original ones on http://map.norsecorp.com/#/
+ Use webpack for the client to get proper modularisation and other ES6/ES7 features.
+ Use babel on the server for more ES6/ES7 features.
