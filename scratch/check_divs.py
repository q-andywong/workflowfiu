
import sys

def balance_divs(filepath):
    with open(filepath, 'r') as f:
        lines = f.readlines()
    
    stack = []
    for i, line in enumerate(lines):
        # Very simple regex-like check
        # This won't handle everything but might help identify the mismatch
        opens = line.count('<div')
        closes = line.count('</div')
        for _ in range(opens):
            stack.append(i + 1)
        for _ in range(closes):
            if stack:
                stack.pop()
            else:
                print(f"Stray closing div at line {i+1}")
    
    if stack:
        print(f"Unclosed divs starting at lines: {stack}")
    else:
        print("Divs are balanced (roughly)")

balance_divs('src/pages/CaseAnalysis.tsx')
