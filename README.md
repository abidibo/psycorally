#PsycoRally

![Screenshot](http://github.com/abidibo/psycorally/raw/master/psycorally.png)

PsycoRally is an html5 racing game made with phaser framework

Play it at http://psycorally.abidibo.net

##The game
This is an arcade racing game. Cross the finish line in the shortest possible time. Be sure to pass through all the track partials (arrows on the road), this is the only rule.
You can choose different vehicles, with different performance on different terrains, choose you preferred one and go fast.

##Physics
The vehicle motion is independent from the computer performances. Player motion is calculated considering real time intervals.

The motion is calculated every small dt interval, which in the best situation is equal to 16ms (60 fps).

The motion is described in polar coordinates. In such dt interval the linear motion is considered to be a constant acceleration motion.
The angular motion is uniform, constant velocity, acceleration equals to 0.
When no acceleration/deceleration is applied,  friction is taken into account, a linear friction proportional to velocity, and an angular friction,
which is constant.

In each dt interval the deltax and deltay (spatial infinitesimal changes) are calculated and the vehicle is moved consequently.

So I don't use the phaser physics system for the vehicle motion, for this reason I can't either use the collide and separate features of the framework.
I've written my collide and separate functions, which are very similar to phaser's ones, but less precise.
I prefer to keep a real time motion and lose something in collisions.
Maybe there is a way to use phaser velocity and acceleration in polar coordinates in order to have available such methods, I'll investigate.

##TODO
- Mobile game controller
- change track/vehicle in ranking stage
- Trying to use phaser physics in toto
- Multiplayer
- Shooting
- Bonus/Malus

##License
This software is distributed under the MIT License, read LICENSE.md
