
import re

def rebalance_jsx(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Split into lines
    lines = content.split('\n')
    
    depth = 0
    new_lines = []
    
    for line in lines:
        opens = re.findall(r'<div(?!\w)', line)
        closes = re.findall(r'</div>', line)
        depth += len(opens) - len(closes)
        new_lines.append(line)
        
    print(f"Final depth before fix: {depth}")
    
    # If depth > 0, add missing closes
    while depth > 0:
        new_lines.append('        </div>')
        depth -= 1
    
    # Add root fragment close
    new_lines.append('    </>')
    new_lines.append(');')
    new_lines.append('};')
    
    # Write back
    with open('balanced_block.txt', 'w') as f:
        f.write('\n'.join(new_lines))

rebalance_jsx('return_block.txt')
