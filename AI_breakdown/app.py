from flask import Flask, request, jsonify
from transformers import pipeline
import json

app = Flask(__name__)

# Load the model (using zero-shot classification for simplicity)
model = pipeline('zero-shot-classification', model='facebook/bart-large-mnli')

# Load dataset
with open('goals_dataset.json', 'r') as f:
    data = json.load(f)

@app.route('/suggest_breakdown', methods=['POST'])
def suggest_breakdown():
    goal = request.json.get('goal')
    amount = request.json.get('amount')
    
    # Find the matching goal breakdown
    goal_data = next((item for item in data if item['goal'].lower() == goal.lower()), None)
    if not goal_data:
        return jsonify({"error": "Goal not found"}), 404

    breakdown = goal_data['breakdown']
    total_cost = sum(item['cost'] for item in breakdown)
    
    # Scale the breakdown costs based on the specified amount
    scale_factor = amount / total_cost
    scaled_breakdown = [{"item": item['item'], "cost": round(item['cost'] * scale_factor, 2)} for item in breakdown]

    return jsonify(scaled_breakdown)

if __name__ == '__main__':
    app.run(debug=True)

