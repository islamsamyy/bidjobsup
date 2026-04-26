@AGENTS.md

## graphify RAG System & Obsidian Vault

This project has a graphify knowledge graph at `graphify-out/` that serves as a retrieval-augmented generation (RAG) system for codebase data.

### Graphify Files
- `graphify-out/GRAPH_REPORT.md` - god nodes, communities, and architecture overview
- `graphify-out/wiki/index.md` - navigable wiki for codebase knowledge (if available)
- `graphify-out/cost.json` - metadata about graph construction and coverage

**When to use graphify:**
- Architecture questions: read `GRAPH_REPORT.md` for god nodes and community structure
- Codebase navigation: use for understanding how modules connect
- Component relationships: identify dependencies and communication patterns
- System design: reference for data flow and responsibilities

### Obsidian Vault (Recommended)
An interactive knowledge base has been created at `obsidian-vault/` for easier exploration:

**Key Documents:**
- `README.md` - Quick navigation hub
- `VAULT-GUIDE.md` - How to use the vault
- `God-Nodes.md` - The 6 most critical functions (55-9 edges each)
- `Communities-Index.md` - All 126 communities organized by strength
- `Analysis/System-Architecture.md` - Deep architecture analysis
- `Community-[0-5]-*.md` - Core feature documentation

**How to use:**
1. Open vault in Obsidian: `File → Open vault folder → e:\bidjob\obsidian-vault`
2. Start with `README.md` for quick orientation
3. Use Graph View (Ctrl+G) to visualize connections
4. Use Quick Switcher (Ctrl+O) to jump between documents
5. Check `VAULT-GUIDE.md` for detailed navigation tips

**Maintenance:**
- After modifying code files, run `graphify update .` to refresh `graphify-out/GRAPH_REPORT.md`
- Update vault documents manually with new insights
- Add tags to important notes for quick filtering
- The vault is a living document - keep it current

**Vault Structure:**
```
obsidian-vault/
├── README.md (start here)
├── VAULT-GUIDE.md (detailed how-to)
├── God-Nodes.md (critical functions)
├── Communities-Index.md (all 126 communities)
├── Community-[0-5]-*.md (main features)
├── Analysis/System-Architecture.md (deep dive)
├── Templates/ (for new documentation)
└── .obsidian/ (configuration)
```
