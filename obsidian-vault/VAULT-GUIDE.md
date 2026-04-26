# Obsidian Vault Guide - BidJob Codebase

This vault is a **knowledge base** of your codebase structure, built from the graphify knowledge graph. It's designed to help you navigate, understand, and make decisions about your code.

## What's Inside

### Core Documents
- **[[README]]** - Quick navigation hub
- **[[God-Nodes]]** - The 6 most critical functions in your system
- **[[Communities-Index]]** - All 126 communities, organized by strength
- **[[Analysis/System-Architecture]]** - Deep dive into architecture

### Feature Communities
- **[[Community-0-Jobs-Contacts|Community 0: Jobs & Contacts]]**
- **[[Community-1-Auth-System|Community 1: Authentication]]**
- **[[Community-3-Contracts-Escrow|Community 3: Contracts & Escrow]]**
- **[[Community-5-Admin-Dashboard|Community 5: Admin Dashboard]]**

*See [[Communities-Index]] for the full list*

### Templates
- `Templates/Community-Template.md` - For documenting new communities
- `Templates/Function-Template.md` - For documenting functions

## How to Use This Vault

### 1. Finding Code

**Q: "Where is the payment logic?"**
1. Open [[God-Nodes#createClient|God Nodes]]
2. Look for payment-related functions
3. Jump to [[Community-3-Contracts-Escrow|Community 3: Contracts & Escrow]]
4. Find specific functions and their locations

**Q: "How does authentication work?"**
1. Open [[Community-1-Auth-System]]
2. See the complete login/signup/reset flows
3. Click links to specific functions

### 2. Understanding Systems

**Q: "What does getAuthUser() do?"**
1. Go to [[God-Nodes#getAuthUser|getAuthUser()]]
2. See all 55 connections
3. Understand which communities depend on it

**Q: "What breaks if I change X?"**
1. Find the function in [[Communities-Index]]
2. Check "Connected to" sections
3. See which communities are affected

### 3. Architecture Decisions

**Q: "Should I move this code?"**
1. Check [[Analysis/System-Architecture]]
2. Look at community cohesion and dependencies
3. Verify impact on god nodes

**Q: "Why is this code here?"**
1. Find the function in [[Communities-Index]]
2. Read the community overview
3. Check data flow diagrams

### 4. Code Review

When reviewing code changes:
1. Find affected functions in vault
2. Check if they're god nodes (high impact)
3. Verify dependencies haven't changed
4. Look for inferred edges that might be affected

## Vault Structure

```
obsidian-vault/
├── README.md                          # Start here
├── VAULT-GUIDE.md                     # This file
├── God-Nodes.md                       # Critical functions
├── Communities-Index.md               # All communities (index)
│
├── Community-0-Jobs-Contacts.md       # Job management
├── Community-1-Auth-System.md         # Authentication
├── Community-3-Contracts-Escrow.md   # Payments & contracts
├── Community-5-Admin-Dashboard.md    # Admin tools
│
├── Analysis/
│   └── System-Architecture.md         # Deep architecture analysis
│
├── Templates/
│   ├── Community-Template.md          # Template for new communities
│   └── Function-Template.md           # Template for functions
│
└── .obsidian/
    └── (Obsidian configuration)
```

## Key Concepts

### God Nodes
The 6 most connected functions in your codebase. They are:
1. **getAuthUser()** - 55 edges - Authentication gateway
2. **Error()** - 34 edges - Error handling
3. **createClient()** - 23 edges - Database access
4. Others with 12-15 edges each

**Why they matter**: Changes here affect the entire system. High test coverage essential.

### Communities
Groups of related functions. Examples:
- **Community 1**: All auth functions (login, signup, reset password)
- **Community 3**: All payment functions (contracts, escrow, milestones)
- **Community 5**: All admin functions (moderation, user management)

**Cohesion Score** (0-1): How tightly connected functions are. Higher = better organized.

### Edges
Connections between functions. Two types:
- **Extracted** (67%): Explicitly found in code
- **Inferred** (33%): AI-reasoned but not explicitly coded

Inferred edges should be verified when refactoring.

## Quick Navigation Tips

### Using Obsidian

1. **Graph View** (Ctrl+G or Cmd+G)
   - See visual connections between notes
   - Click nodes to jump to documents
   - Zoom out to see overall structure

2. **Backlinks**
   - Right panel shows what links to current note
   - Useful for finding dependencies

3. **Search** (Ctrl+F or Cmd+F)
   - Search for function names across vault
   - Find related discussions
   - Locate code locations

4. **Quick Switcher** (Ctrl+O or Cmd+O)
   - Jump to any document quickly
   - Type partial names to find

### Reading Links

Documents use **[[Name]]** syntax for links:
- **[[Community-1-Auth-System]]** - Links to community documentation
- **[[God-Nodes#getAuthUser]]** - Links to specific section
- **[[Community-1-Auth-System|Custom Text]]** - Link with custom label

## Keeping the Vault Updated

### Manual Refresh
After major code changes:
1. Run `graphify update .` in project root
2. This updates `graphify-out/GRAPH_REPORT.md`
3. Manually update vault documents with new information

### What to Update
- Add new communities when creating new features
- Update god nodes if you refactor core functions
- Add inferred edges that you confirm as correct
- Note removed edges when deleting code

## Common Queries

### "What functions call getAuthUser()?"
→ Go to [[God-Nodes#getAuthUser]], see "Functions that call"

### "What happens after a user logs in?"
→ Read [[Community-1-Auth-System]], follow "Login Flow"

### "How are disputes resolved?"
→ Read [[Community-9-Disputes]], see workflow diagram

### "What's the payment lifecycle?"
→ Read [[Community-3-Contracts-Escrow]], see "Contract Lifecycle"

### "Where is the admin panel?"
→ Read [[Community-5-Admin-Dashboard]], see "Related Pages"

### "How do I add a new feature?"
→ Use [[Analysis/System-Architecture]], check dependencies

## Tips & Tricks

### 1. Use Tags for Quick Filtering
Add tags to notes like `#critical`, `#refactor-needed`, `#deprecated`

### 2. Link Related Notes
When creating new community docs, link to related ones

### 3. Keep Data Flow Diagrams
Use ASCII diagrams like:
```
Input
  ↓
Process
  ↓
Output
```

### 4. Note Inferred Edges
Mark inferred edges with [INFERRED] so you remember to verify them

### 5. Version Your Analysis
Add "Last Updated: 2026-04-26" to important documents

## Troubleshooting

### Links are broken
- Vault structure may have changed
- Try using Quick Switcher (Ctrl+O) instead
- Check [[Communities-Index]] for correct paths

### Information is outdated
- Run `graphify update .` to refresh analysis
- Update vault manually with new findings
- Add timestamps to important notes

### Can't find a function
- Use Obsidian search (Ctrl+F)
- Check [[Communities-Index]] for full listing
- Read [[Analysis/System-Architecture]] for overview

## Integration with Development

### Code Review Workflow
1. Developer submits PR
2. Reviewer opens vault for context
3. Check affected communities
4. Verify god node dependencies
5. Review inferred edges

### Refactoring Workflow
1. Identify function to refactor
2. Find in vault (note all dependencies)
3. Plan changes (check god node impact)
4. Execute refactoring
5. Run `graphify update .`
6. Update vault docs
7. Commit with enhanced context

### Bug Investigation
1. Find error in logs
2. Search vault for relevant functions
3. Check community documentation
4. Trace through data flow diagrams
5. Identify root cause

## Questions?

If the vault doesn't have what you need:
1. Check [[Communities-Index]] - may be documented as a thin community
2. Look at [[Analysis/System-Architecture]] - might have answers
3. Check [[God-Nodes]] - may be connected to the system
4. Consider creating a new note using templates

---

**Last Updated**: 2026-04-26  
**Source**: graphify-out/ knowledge graph  
**Maintenance**: Update after running `graphify update .`
