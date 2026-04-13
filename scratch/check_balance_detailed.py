
def find_imbalance(filepath):
    with open(filepath, 'r') as f:
        lines = f.readlines()
    
    depth = 0
    import re
    
    for i, line in enumerate(lines):
        line_num = i + 1
        
        # Count opens
        # Look for <div matching strictly (not components, not self-closing)
        opens = re.findall(r'<div(?!\w)', line)
        closes = re.findall(r'</div>', line)
        
        old_depth = depth
        depth += len(opens) - len(closes)
        
        if depth != old_depth:
            print(f"Line {line_num:4}: Depth {old_depth:2} -> {depth:2} | {line.strip()[:60]}")
            
    print(f"Final Depth: {depth}")

find_imbalance('src/pages/CaseAnalysis.tsx')
