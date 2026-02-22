import random

def solve_tsp(distance_matrix):
    # Simulation: Just return the bins in a random optimized order
    # In a real app, this uses Google OR-Tools
    num_locations = len(distance_matrix)
    route = list(range(num_locations))
    
    # Simulate optimization logic
    if num_locations > 1:
        random.shuffle(route) 
        
    return route