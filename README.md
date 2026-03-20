## Project URL: [https://github.com/Amu-Mike/hw1-grid-rl](https://github.com/Amu-Mike/hw1-grid-rl)
# GridWorld Reinforcement Learning - HW1
This is a Flask-based project for GridWorld development and Reinforcement Learning algorithm demonstration. It implements Random Policy Evaluation and Value Iteration.

## Features
### HW1-1: Grid Map Development
- **Dynamic Grid Generation**: Supports 5x5 to 9x9 dimensions.
- **Interactive Setup**: Users can click to set:
  - **START**: Green.
    - **END**: Red.
      - **Obstacles**: Grey (n-2 required).
      - **Coordinate System**: Labels (0, 1, 2...) for easy positioning.

      ### HW1-2: Random Policy & Value Evaluation
      - **Random Policy**: Backend automatically generates random actions (Up, Down, Left, Right).
      - **Value Evaluation**: Uses Bellman Equation to calculate State Value Function V(s).
      - **Matrix Display**: Shows both Value Matrix and Policy Matrix.

      ### HW1-3: Value Iteration & Optimal Policy
      - **Value Iteration**: Implements Value Iteration algorithm.
      - **Optimal Policy**: Automatically derives and shows optimal actions.
      - **Path Visualization**: Highlights the optimal path from START to END.

      ## Technology Stack
      - **Backend**: Python / Flask
      - **Frontend**: HTML5, CSS3, JavaScript
      - **Visualization**: Custom grid system, smooth animations, Glassmorphism design.

      ## How to Run
      1. Install dependencies: `pip install flask`
      2. Run server: `python app.py`
      3. Open browser: `http://127.0.0.1:5000`

      ## Structure
      - `app.py`: Flask backend and RL logic.
      - `templates/index.html`: Frontend structure.
      - `static/css/style.css`: UI design.
      - `static/js/script.js`: Frontend logic.
      
