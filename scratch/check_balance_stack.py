
import re

def find_unclosed_tags(filepath):
    with open(filepath, 'r') as f:
        lines = f.readlines()
    
    stack = []
    
    # Regex to find <div (not self-closing) and </div>
    # We strictly look for <div ... > or <div ... />
    
    for i, line in enumerate(lines):
        line_num = i + 1
        
        # Simple tokenization for divs
        # Find all <div and </div>
        # Note: this is a heuristic. It doesn't handle nested strings like <div attr="</div>" />
        
        # We search for <div tags
        # We need to distinguish between <div ... > and <div ... />
        
        ptr = 0
        while True:
            open_div = line.find('<div', ptr)
            close_div = line.find('</div>', ptr)
            
            if open_div == -1 and close_div == -1:
                break
                
            if open_div != -1 and (close_div == -1 or open_div < close_div):
                # Found an opening <div
                # Check if it's self-closing <div ... />
                end_tag = line.find('>', open_div)
                if end_tag != -1:
                    tag_content = line[open_div:end_tag+1]
                    if not tag_content.endswith('/>'):
                        stack.append((line_num, line.strip()))
                ptr = open_div + 4
            else:
                # Found a closing </div>
                if stack:
                    stack.pop()
                else:
                    print(f"ERROR: Extra </div> at line {line_num}")
                ptr = close_div + 6
                
    print(f"\nUNCLOSED TAGS AT END OF FILE:")
    for lnum, text in stack:
        print(f"Line {lnum:4}: {text[:80]}")

find_unclosed_tags('src/pages/CaseAnalysis.tsx')
