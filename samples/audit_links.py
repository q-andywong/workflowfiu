import json

tasks = json.load(open('MockTasksToLoad.json'))
strs  = json.load(open('MockSTRsToLoad.json'))
cmrs  = json.load(open('MockCMRsToLoad.json'))
ctrs  = json.load(open('MockCTRsToLoad.json'))

str_by_subject = {s['linkedSubjectId']: s for s in strs}
cmr_by_subject = {c['linkedSubjectId']: c for c in cmrs}
ctr_by_subject = {c['linkedSubjectId']: c for c in ctrs}

PASS = 'OK'
FAIL = 'FAIL'
WARN = 'WARN'

issues = []

print('=' * 70)
print('MOCK DATA CROSS-REFERENCE AUDIT')
print('=' * 70)

for t in tasks:
    _2 = t['_2']
    _1 = t['_1']
    sid  = _2['subjectId']
    name = _2['name']
    task_score = _2['scorecardOverallScore']
    audit = _2.get('alertingAuditDetails', {})

    print()
    print(f"  Subject : {sid} — {name}")
    print(f"  Task Score: {task_score}")

    # ── STR linkage ─────────────────────────────────────────────────────────
    s = str_by_subject.get(sid)
    if not s:
        tag = FAIL
        msg = "No STR found for this subject"
        issues.append((FAIL, sid, msg))
        print(f"  STR      : [{tag}] {msg}")
    else:
        str_score = s['scorecardOverallScore']
        score_ok = abs(str_score - task_score) < 0.1
        score_tag = PASS if score_ok else FAIL
        if not score_ok:
            issues.append((FAIL, sid, f"Score mismatch: task={task_score} STR={str_score}"))
        print(f"  STR      : [{score_tag}] {s['reportId']} | score={str_score}")

        # Check STR ID appears in task alertingAuditDetails
        audit_str = json.dumps(audit)
        if s['reportId'] in audit_str:
            print(f"  STR link : [OK ] STR reportId found in task alertingAuditDetails")
        else:
            msg = f"STR reportId {s['reportId']} not in task alertingAuditDetails"
            issues.append((WARN, sid, msg))
            print(f"  STR link : [WARN] {msg}")

        # Check typology listed in task scorecard matches STR crime types
        task_scores = _1.get('scores', [])
        str_crimes  = s['tabV_reasonsForSuspicion']['possibleCrimeTypes']
        print(f"  Crimes   : STR={str_crimes}")
        print(f"  ScoreKeys: {[sc.get('scoreType','?') for sc in task_scores[:4]]}...")

    # ── CMR linkage ─────────────────────────────────────────────────────────
    c = cmr_by_subject.get(sid)
    if c:
        cmr_str_ref = c['fiu_annotations']['linkedSTR']
        expected_str = str_by_subject.get(sid, {}).get('reportId', 'NONE')
        link_ok = cmr_str_ref == expected_str
        tag = PASS if link_ok else FAIL
        if not link_ok:
            issues.append((FAIL, sid, f"CMR.linkedSTR={cmr_str_ref} != STR.reportId={expected_str}"))
        print(f"  CMR      : [{tag}] {c['reportId']} -> linkedSTR={cmr_str_ref}")
        # Check CMR subject name matches task
        name_ok = c['linkedSubjectName'] == name
        ntag = PASS if name_ok else FAIL
        if not name_ok:
            issues.append((FAIL, sid, f"CMR name mismatch: CMR={c['linkedSubjectName']} Task={name}"))
        print(f"  CMR name : [{ntag}] {c['linkedSubjectName']}")

    # ── CTR linkage ─────────────────────────────────────────────────────────
    ct = ctr_by_subject.get(sid)
    if ct:
        ctr_str_ref = ct['fiu_annotations']['linkedSTR']
        expected_str = str_by_subject.get(sid, {}).get('reportId', 'NONE')
        link_ok = ctr_str_ref == expected_str
        tag = PASS if link_ok else FAIL
        if not link_ok:
            issues.append((FAIL, sid, f"CTR.linkedSTR={ctr_str_ref} != STR.reportId={expected_str}"))
        print(f"  CTR      : [{tag}] {ct['reportId']} -> linkedSTR={ctr_str_ref}")
        name_ok = ct['linkedSubjectName'] == name
        ntag = PASS if name_ok else FAIL
        if not name_ok:
            issues.append((FAIL, sid, f"CTR name mismatch: CTR={ct['linkedSubjectName']} Task={name}"))
        print(f"  CTR name : [{ntag}] {ct['linkedSubjectName']}")

    # ── CMR/CTR score vs task score ─────────────────────────────────────────
    if c:
        cmr_score = c['scorecardOverallScore']
        ok = abs(cmr_score - task_score) < 0.1
        tag = PASS if ok else WARN
        if not ok:
            issues.append((WARN, sid, f"CMR score={cmr_score} differs from task={task_score}"))
        print(f"  CMR score: [{tag}] {cmr_score} vs task {task_score}")
    if ct:
        ctr_score = ct['scorecardOverallScore']
        ok = abs(ctr_score - task_score) < 0.1
        tag = PASS if ok else WARN
        if not ok:
            issues.append((WARN, sid, f"CTR score={ctr_score} differs from task={task_score}"))
        print(f"  CTR score: [{tag}] {ctr_score} vs task {task_score}")

print()
print('=' * 70)
print(f'SUMMARY: {len(issues)} issue(s) found')
print('=' * 70)
if issues:
    for sev, sid, msg in issues:
        print(f"  [{sev}] {sid}: {msg}")
else:
    print("  All links verified OK.")
print()

# Also dump what alertingAuditDetails keys look like for a sample
print('Sample alertingAuditDetails keys (task 1):')
sample = tasks[0]['_2'].get('alertingAuditDetails', {})
print(f"  {list(sample.keys())}")
