---
name: agentscope-patterns
description: Alibaba's production-ready multi-agent framework. MCP + A2A + Claude support. Use for building multi-agent systems, NLP pipelines, and deploying agents to production.
---

# AgentScope Patterns

## What It Is
Production-ready multi-agent AI framework by Alibaba (19.6k+ stars).
- Native MCP + A2A (Agent-to-Agent) protocol support
- Claude/Anthropic integration built-in
- Fine-tuning support (relevant for A100 NLP work)
- OpenTelemetry observability built-in
- Deploy: local → serverless → Kubernetes

## Install
```bash
pip install agentscope  # already installed
```

## Claude Integration
```python
import agentscope
from agentscope.agents import ReActAgent

agentscope.init(
    model_configs=[{
        "config_name": "claude",
        "model_type": "anthropic_chat",
        "model_name": "claude-sonnet-4-6",
        "api_key": os.environ["ANTHROPIC_API_KEY"],
    }]
)

agent = ReActAgent(
    name="researcher",
    model_config_name="claude",
    tools=[...],  # MCP tools or custom tools
)
```

## MCP Tool Integration
```python
from agentscope.tools import MCPToolkit

# Connect any MCP server as tools
toolkit = MCPToolkit(server_url="http://localhost:8000")
agent = ReActAgent(name="agent", tools=toolkit.get_tools())
```

## Multi-Agent Coordination (MsgHub)
```python
from agentscope.message import Msg
from agentscope.msghub import msghub

agents = [researcher, coder, reviewer]
with msghub(agents) as hub:
    hub.broadcast(Msg("user", "Build a sentiment classifier", "user"))
```

## NLP Pipeline Pattern (for A100 work)
```python
# Route NLP tasks through AgentScope + HuggingFace
from agentscope.agents import ReActAgent
from agentscope.tools import HuggingFaceTool

nlp_agent = ReActAgent(
    name="nlp-engineer",
    model_config_name="claude",
    tools=[HuggingFaceTool(task="text-classification")],
)
```

## Key Differentiators vs LangChain
- Less opinionated — leverages model reasoning, not rigid chains
- Native fine-tuning support
- Built-in production deployment (K8s)
- A2A protocol for inter-agent comms
- AgentScope Studio — visual workflow designer
