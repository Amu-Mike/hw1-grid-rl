
@app.route('/api/random_policy', methods=['POST'])
def random_policy():
      data = request.json
      n = int(data['n'])
      end = tuple(data['end']) if data.get('end') else None
      obstacles = [tuple(obs) for obs in data.get('obstacles', [])]

    # Generate a random deterministic policy
      policy = []
      for r in range(n):
                row = []
                for c in range(n):
                              row.append(random.choice(list(ACTIONS.keys())))
                          policy.append(row)

      V = evaluate_policy(n, end, obstacles, policy)
      return jsonify({
          'policy': policy,
          'values': V
      })

@app.route('/api/value_iteration', methods=['POST'])
def do_value_iteration():
      data = request.json
      n = int(data['n'])
      end = tuple(data['end']) if data.get('end') else None
      obstacles = [tuple(obs) for obs in data.get('obstacles', [])]

    V, policy = value_iteration_impl(n, end, obstacles)
    return jsonify({
              'policy': policy,
              'values': V
    })

def evaluate_policy(n, end, obstacles, policy):
      V = [[0.0 for _ in range(n)] for _ in range(n)]
      while True:
                delta = 0
                new_V = [row[:] for row in V]
                for r in range(n):
                              for c in range(n):
                                                if (r, c) == end or (r, c) in obstacles:
                                                                      continue

                                                dr, dc = ACTIONS[policy[r][c]]
                                                nr, nc = r + dr, c + dc

                                  # Check boundaries and obstacles
                                                if 0 <= nr < n and 0 <= nc < n and (nr, nc) not in obstacles:
                                                                      nxt_r, nxt_c = nr, nc
else:
                    nxt_r, nxt_c = r, c # Hit a wall/obstacle, stay in place

                reward = REWARD_GOAL if (nxt_r, nxt_c) == end else REWARD_STEP
                next_v = 0.0 if (nxt_r, nxt_c) == end else V[nxt_r][nxt_c]

                v = reward + GAMMA * next_v
                new_V[r][c] = v
                delta = max(delta, abs(v - V[r][c]))

        V = new_V
        if delta < THETA:
                      break
              return V

def value_iteration_impl(n, end, obstacles):
      V = [[0.0 for _ in range(n)] for _ in range(n)]
      policy = [['up' for _ in range(n)] for _ in range(n)]

    while True:
              delta = 0
              new_V = [row[:] for row in V]
              for r in range(n):
                            for c in range(n):
                                              if (r, c) == end or (r, c) in obstacles:
                                                                    continue

                                              best_v = -float('inf')
                                              for a_name, (dr, dc) in ACTIONS.items():
                                                                    nr, nc = r + dr, c + dc
                                                                    if 0 <= nr < n and 0 <= nc < n and (nr, nc) not in obstacles:
                                                                                              nxt_r, nxt_c = nr, nc
else:
                          nxt_r, nxt_c = r, c

                    reward = REWARD_GOAL if (nxt_r, nxt_c) == end else REWARD_STEP
                    next_v = 0.0 if (nxt_r, nxt_c) == end else V[nxt_r][nxt_c]
                    v = reward + GAMMA * next_v
                    if v > best_v:
                                              best_v = v

                new_V[r][c] = best_v
                delta = max(delta, abs(best_v - V[r][c]))

        V = new_V
        if delta < THETA:
                      break

    # Extract optimal policy
    for r in range(n):
              for c in range(n):
                            if (r, c) == end or (r, c) in obstacles:
                                              policy[r][c] = None
                                              continue

                            best_v = -float('inf')
                            best_a = 'up'
                            for a_name, (dr, dc) in ACTIONS.items():
                                              nr, nc = r + dr, c + dc
                                              if 0 <= nr < n and 0 <= nc < n and (nr, nc) not in obstacles:
                                                                    nxt_r, nxt_c = nr, nc
else:
                      nxt_r, nxt_c = r, c

                reward = REWARD_GOAL if (nxt_r, nxt_c) == end else REWARD_STEP
                next_v = 0.0 if (nxt_r, nxt_c) == end else V[nxt_r][nxt_c]
                v = reward + GAMMA * next_v
                if v > best_v:
                                      best_v = v
                                      best_a = a_name
                              policy[r][c] = best_a

    return V, policy

if __name__ == '__main__':
      app.run(host='0.0.0.0', port=5000, debug=True)
  
