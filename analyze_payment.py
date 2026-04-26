import json
from networkx.readwrite import json_graph
import networkx as nx
from pathlib import Path

data = json.loads(Path('graphify-out/graph.json').read_text())
G = json_graph.node_link_graph(data, edges='links')

print('=' * 70)
print('PAYMENT SYSTEM ARCHITECTURE ANALYSIS')
print('=' * 70)

key_funcs = {
    'releasemilestonepayment': 'Milestone Payment Release',
    'updatemilestonestatus': 'Update Milestone Status',
    'updatedisputestatus': 'Update Dispute Status',
    'stripecheckoutbutton': 'Stripe Checkout',
}

found = {}
for nid, ndata in G.nodes(data=True):
    lbl = ndata.get('label', '').lower()
    for key, desc in key_funcs.items():
        if key in lbl and key not in found:
            found[key] = (nid, ndata)
            break

print('\n[KEY PAYMENT FUNCTIONS]')
for key, desc in key_funcs.items():
    if key in found:
        nid, ndata = found[key]
        src = ndata.get('source_file', 'unknown')
        deg = G.degree(nid)
        print('  ' + desc)
        print('     File: ' + src)
        print('     Connections: ' + str(deg))
        print()

print('[DATA FLOW ARCHITECTURE]')
print('  Contract (root entity)')
print('    +-- Milestones (work breakdown)')
print('    |   +-- Payments (fund distribution per milestone)')
print('    +-- Disputes (conflict resolution)')
print('    |   +-- Evidence (proof of claims)')
print('    +-- Escrow (holds funds during contract)')
print('        +-- Released after milestone completion')

print('\n[AUTHENTICATION FLOW]')
print('  All payment actions require:')
print('  - getAuthUser() [55 connections - auth hub]')
print('  - adminAuth() [12 connections - admin check]')
print('  - isParticipant() [contract verification]')

print('\n[STRIPE INTEGRATION POINTS]')
print('  1. StripeCheckoutButton')
print('     - Creates payment intent')
print('     - Initiates new transaction')
print('  2. StripeBillingPortalButton')
print('     - Manages subscriptions')
print('     - View/update payment methods')
print('  3. Webhooks (from stripe API route)')
print('     - Handles payment_intent.succeeded')
print('     - Updates contract/milestone status')

print('\n[CRITICAL DEPENDENCIES]')
print('  Payment Release requires:')
for key in ['releasemilestonepayment']:
    if key in found:
        nid, ndata = found[key]
        deps = []
        for neighbor in G.neighbors(nid):
            nlabel = G.nodes[neighbor].get('label', '')
            if 'auth' in nlabel.lower() or 'dispute' in nlabel.lower() or 'contract' in nlabel.lower():
                deps.append(nlabel)
        if deps:
            for dep in deps[:5]:
                print('    - ' + dep)

print('\n[DISPUTE RESOLUTION PATH]')
print('  updateDisputeStatus -> adminAuth()')
print('                      -> isParticipant()')
print('                      -> admin.ts')
print('  Evidence upload triggers webhook')
print('  Admin reviews -> marks resolved/rejected')
print('  Affects escrow release decision')

print('\n[MISSING CONNECTIONS - AREAS FOR IMPROVEMENT]')
print('  126 separate communities suggests:')
print('  - Payment logic may not be tightly integrated')
print('  - Potential for refactoring into unified Payment module')
print('  - Consider centralizing escrow management')
