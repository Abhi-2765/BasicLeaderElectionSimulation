# Leader Election Simulator

A small website that visualizes how a leader election algorithm works in a ring network.

Nodes are connected in form of a ring and pass messages to their neighbors. Each node compares ID in the token it receives to its own ID and either forwards the packet, drops it, or declares itself the leader. You can customize the node IDs, speed, direction, and win condition (Min/Max).
