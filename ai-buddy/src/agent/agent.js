const { StateGraph, Annotation, MessagesAnnotation } = require("@langchain/langgraph");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const tools = require("./tools");
const { ToolMessage, AIMessage, HumanMessage } = require("@langchain/core/messages");

// Initialize Gemini model
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0.5,
});

// Initialize StateGraph
const graph = new StateGraph(MessagesAnnotation)
  // Node to handle tool calls
  .addNode("tools", async (state, config) => {
    const lastMessage = state.messages[state.messages.length - 1];
    const toolsCall = lastMessage.tool_calls || [];

    const toolCallResults = await Promise.all(
      toolsCall.map(async (call) => {
        const tool = tools[call.name];
        if (!tool) throw new Error("Tool not found");

        const toolInput = call.args;
        const toolResult = await tool.func({
          ...toolInput,
          token: config.metadata.token,
        });

        // ✅ Corrected: Use "name" instead of "toolName"
        return new ToolMessage({ content: toolResult, name: call.name });
      })
    );

    state.messages.push(...toolCallResults);
    return state;
  })
  // Node to handle chat with model
  .addNode("chat", async (state, config) => {
    const response = await model.invoke(state.messages, {
      tools: [tools.searchProduct, tools.addProductToCart],
    });

    state.messages.push(
      new AIMessage({
        content: response.text,
        tool_calls: response.tool_calls,
      })
    );

    return state;
  })
  // Start the agent
  .addEdge("__start__", "chat")
  // Conditional edge: if tools were called, go to "tools" node
  .addConditionalEdges("chat", async (state) => {
    const lastMessage = state.messages[state.messages.length - 1];
    if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
      return "tools";
    } else {
      return "__end__";
    }
  })
  // After tools are executed, go back to chat
  .addEdge("tools", "chat");

// Compile agent
const agent = graph.compile();

module.exports = agent;
