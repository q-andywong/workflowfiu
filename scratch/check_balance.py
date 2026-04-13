
def check_jsx_balance(filepath):
    with open(filepath, 'r') as f:
        lines = f.readlines()
    
    stack = []
    for i, line in enumerate(lines):
        line_num = i + 1
        # Very crude check for <div and </div>
        # This doesn't handle strings or comments well, but might catch the obvious ones
        
        # Handle </div> first
        count_close = line.count('</div>')
        for _ in range(count_close):
            if stack:
                stack.pop()
            else:
                print(f"Error: Extra </div> at line {line_num}")
                
        # Handle <div
        # Must exclude self-closing and components
        import re
        opens = re.findall(r'<div(?!\w)', line)
        for _ in opens:
            stack.append(line_num)
            
    print(f"Remaining stack size: {len(stack)}")
    if stack:
        print(f"Unclosed <div> starts at lines: {stack}")

check_jsx_balance('src/pages/CaseAnalysis.tsx')
