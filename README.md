# KeywayTech AI Skills

本仓库统一管理本机 AI skills。`code` 包含工程与开发技能，`work` 包含业务交付技能，根目录保留通用技能。

按主要用途归类；合集保留其内部结构。

## Code

| Skill | 用途 |
| --- | --- |
| addyosmani-code-review-and-quality | Conducts multi-axis code review. Use before merging any change. Use when reviewing code written by yourself, another agent, or a human. Use when you need to assess code quality ... |
| agent-browser | Browser automation CLI for AI agents. Use when the user needs to interact with websites, including navigating pages, filling forms, clicking buttons, taking screenshots, extract... |
| algorithmic-art | Creating algorithmic art using p5.js with seeded randomness and interactive parameter exploration. Use this when users request creating art using code, generative art, algorithm... |
| composition-patterns | 详见该 skill 的 SKILL.md。 |
| connect-promptdesign-server | Connect to the PromptDesign production server with its dedicated SSH key. Use when Codex needs to log in to, inspect, or run authorized commands on the PromptDesign server at 82... |
| emil-design-eng | This skill encodes Emil Kowalski's philosophy on UI polish, component design, animation decisions, and the invisible details that make software feel great. |
| figma | Use the Figma MCP server to fetch design context, screenshots, variables, and assets from Figma, and to translate Figma nodes into production code. Trigger when a task involves ... |
| figma-implement-design | Translates Figma designs into production-ready application code with 1:1 visual fidelity. Use when implementing UI code from Figma files, when user mentions "implement design", ... |
| frontend-design | Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or appli... |
| frontend-skill | Use when the task asks for a visually strong landing page, website, app, prototype, demo, or game UI. This skill enforces restrained composition, image-led hierarchy, cohesive c... |
| gh-cli | GitHub CLI (gh) comprehensive reference for repositories, issues, pull requests, Actions, projects, releases, gists, codespaces, organizations, extensions, and all GitHub operat... |
| git-commit | 'Execute git commit with conventional commit message analysis, intelligent staging, and message generation. Use when user asks to commit changes, create a git commit, or mention... |
| git-pr | Use when the user says '提交pr', asks to submit a PR, or asks Codex to finish a git change through GitHub: inspect all local changes, group them into commits, push the current bra... |
| gsap-greensock | Use when implementing Disney's 12 animation principles with GSAP (GreenSock Animation Platform) |
| iga-pages | Deploy frontend and full-stack projects to IGA Pages. Use when the user mentions IGA Pages or requests deployment ("deploy my app", "publish this site", "push this live", "deplo... |
| impeccable | Use when the user wants to design, redesign, shape, critique, audit, polish, clarify, distill, harden, optimize, adapt, animate, colorize, extract, or otherwise improve a fronte... |
| mattpoclock-diagnose | Disciplined diagnosis loop for hard bugs and performance regressions. Reproduce → minimise → hypothesise → instrument → fix → regression-test. Use when user says "diagnose this"... |
| mattpoclock-git-guardrails | Set up Claude Code hooks to block dangerous git commands (push, reset --hard, clean, branch -D, etc.) before they execute. Use when user wants to prevent destructive git operati... |
| mattpoclock-grill-with-docs | Grilling session that challenges your plan against the existing domain model, sharpens terminology, and updates documentation (CONTEXT.md, ADRs) inline as decisions crystallise.... |
| mattpoclock-improve-architecture | Find deepening opportunities in a codebase, informed by the domain language in CONTEXT.md and the decisions in docs/adr/. Use when the user wants to improve architecture, find r... |
| mattpoclock-prototype | Build a throwaway prototype to flesh out a design before committing to it. Routes between two branches — a runnable terminal app for state/business-logic questions, or several r... |
| mattpoclock-setup | Sets up an `## Agent skills` block in AGENTS.md/CLAUDE.md and `docs/agents/` so the engineering skills know this repo's issue tracker (GitHub or local markdown), triage label vo... |
| mattpoclock-setup-pre-commit | Set up Husky pre-commit hooks with lint-staged (Prettier), type checking, and tests in the current repo. Use when user wants to add pre-commit hooks, set up Husky, configure lin... |
| mattpoclock-skills | 包含 29 个子 skill 的合集。 |
| mattpoclock-tdd | Test-driven development with red-green-refactor loop. Use when user wants to build features or fix bugs using TDD, mentions "red-green-refactor", wants integration tests, or ask... |
| mattpoclock-to-issues | Break a plan, spec, or PRD into independently-grabbable issues on the project issue tracker using tracer-bullet vertical slices. Use when user wants to convert a plan into issue... |
| mattpoclock-to-prd | Turn the current conversation context into a PRD and publish it to the project issue tracker. Use when user wants to create a PRD from the current context. |
| mattpoclock-triage | Triage issues through a state machine driven by triage roles. Use when user wants to create an issue, triage issues, review incoming bugs or feature requests, prepare issues for... |
| mattpoclock-write-a-skill | Create new agent skills with proper structure, progressive disclosure, and bundled resources. Use when user wants to create, write, or build a new skill. |
| mattpoclock-zoom-out | Tell the agent to zoom out and give broader context or a higher-level perspective. Use when you're unfamiliar with a section of code or need to understand how it fits into the b... |
| naming-analyzer | Suggest better variable, function, and class names based on context and conventions. |
| nextlevelbuilder-ui-ux-pro-max | UI/UX design intelligence. 50 styles, 21 palettes, 50 font pairings, 20 charts, 8 stacks (React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind). Actions: plan, ... |
| prd-critic | Evaluates PRD quality for clarity, testability, and build-readiness across problem clarity, scope, acceptance criteria, edge cases, and metrics. Use before sharing a PRD with en... |
| react-native-skills | 详见该 skill 的 SKILL.md。 |
| readme-generator | This skill creates or updates a README.md file in the GitHub home directory of the current project. The README.md file it generates will conform to GitHub best practices, includ... |
| threejs-webgl | Comprehensive skill for Three.js 3D web development. Use this skill when building interactive 3D scenes, WebGL/WebGPU applications, product configurators, 3D visualizations, or ... |
| todo-planner | Generate or rewrite executable development TODO plans. Use when the user says "规划TODO", "重写TODO", "生成开发计划", "拆任务计划", "plan TODO", or asks Codex to turn review findings, product ... |
| vercel-react-best-practices | React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure opt... |
| web-artifacts-builder | Suite of tools for creating elaborate, multi-component claude.ai HTML artifacts using modern frontend web technologies (React, Tailwind CSS, shadcn/ui). Use for complex artifact... |
| web-design-guidelines | Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best prac... |
| webapp-testing | Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing browser screenshots... |
| writing-plans | Use when you have a spec or requirements for a multi-step task, before touching code |

## Work

| Skill | 用途 |
| --- | --- |
| aso | Optimize an app's store listing for maximum visibility and downloads — keyword strategy, title and subtitle optimization, screenshots, preview videos, rating and review manageme... |
| b2b-brand-marketing | Build and execute brand marketing strategy for B2B companies — thought leadership, ABM brand layer, trust signals, LinkedIn presence, long sales cycle brand touchpoints, and ent... |
| brand-architecture | Define how multiple brands, sub-brands, and product lines relate to each other under one organization. Use when the user says "brand architecture", "sub-brand", "brand portfolio... |
| brand-audit | Assess the health and consistency of an existing brand — identity, messaging, voice, positioning, and market perception. Use when the user says "brand audit", "brand review", "a... |
| brand-context | Foundation skill that captures and stores core brand context — identity, audience, positioning, values, and voice. Use when the user says "set brand context", "save my brand inf... |
| brand-guidelines | Create a comprehensive brand standards document — covering logo usage, color, typography, voice, messaging, and application rules. Use when the user says "brand guidelines", "br... |
| brand-ideation | Generate, evaluate, and narrow brand concepts during early ideation including positioning territories, naming candidates, mood directions, and narrative angles. Use this skill w... |
| brand-identity | Create a visual identity brief for a brand — logo direction, color palette, typography, imagery style, and design system foundations. Use when the user says "visual identity", "... |
| brand-launch | Plan and execute a new brand launch — from internal rollout to public debut. Use when the user says "launch the brand", "brand launch plan", "how do we introduce the brand", "br... |
| brand-manifesto | Write a brand manifesto — a bold, belief-driven declaration of what the brand stands for, fights against, and exists to change. Use when the user says "brand manifesto", "manife... |
| brand-measurement | Define KPIs, metrics, and tracking systems to measure brand health, awareness, perception, and equity over time. Use when the user says "brand measurement", "brand metrics", "ho... |
| brand-messaging | Build a brand's messaging hierarchy — taglines, value propositions, key messages, and proof points for each audience. Use when the user says "brand messaging", "messaging framew... |
| brand-naming | Full brand naming workflow for founders, agencies, and businesses. Use this skill whenever the user says "help me name this brand", "brand naming", "I need a name for", "name id... |
| brand-packaging | Create a packaging design brief — structure, visual direction, hierarchy, materials, and unboxing experience. Use when the user says "packaging design", "packaging brief", "prod... |
| brand-partnerships | Build brand partnership strategy — co-branding campaigns, brand collaborations, licensing deals, partner brand alignment, and joint marketing. Use when the user says "brand part... |
| brand-positioning | Define and sharpen a brand's market positioning — where it sits relative to competitors, what it owns, and how it differentiates. Use when the user says "brand positioning", "po... |
| brand-story | Craft a brand's origin story, founder narrative, and "why we exist" statement. Use when the user says "brand story", "origin story", "founder story", "why we exist", "about us",... |
| brand-strategy | Full brand strategy workflow for agencies and brand consultants. Acts as a senior brand strategist — collects client information through a structured questionnaire, then generat... |
| brand-voice | Define a brand's verbal identity — tone, voice, writing style, vocabulary, and messaging rules. Use when the user says "brand voice", "tone of voice", "how should we write", "wr... |
| canvas-design | Create beautiful visual art in .png and .pdf documents using design philosophy. You should use this skill when the user asks to create a poster, piece of art, design, or other s... |
| competitor-branding | Analyze how competitors present their brand — identity, messaging, positioning, voice, and visual style — to find gaps and opportunities. Use when the user says "competitor bran... |
| d2c-marketing | Build and execute marketing strategy for Direct-to-Consumer (DTC) brands — customer acquisition, retention, email flows, social proof, subscription models, and repeat purchase m... |
| doc-coauthoring | Guide users through a structured workflow for co-authoring documentation. Use when user wants to write documentation, proposals, technical specs, decision docs, or similar struc... |
| email-marketing | Build and run a full email marketing channel — list building, deliverability, segmentation, newsletter strategy, campaign types, A/B testing, and email design. Use when the user... |
| google-ads | Plan, build, and optimize Google Ads campaigns — Search, Shopping, Performance Max, Display, and YouTube — including keyword research, match types, bidding strategy, Quality Sco... |
| guizang-ppt-skill | 生成横向翻页网页 PPT（单 HTML 文件），含 WebGL 背景、章节幕封、数据大字报、图片网格等模板。提供两种风格：① "电子杂志 × 电子墨水"（衬线 + 流体背景 + 暖色） ② "瑞士国际主义"（无衬线 + 网格点阵 + IKB/柠檬黄/柠檬绿/安全橙高亮）。当用户需要制作分享 / 演讲 / 发布会风格的网页 PPT，或提到"杂志风 PPT... |
| hyperframes | Create video compositions, animations, title cards, overlays, captions, voiceovers, audio-reactive visuals, and scene transitions in HyperFrames HTML. Use when asked to build an... |
| hyperframes-media | Asset preprocessing for HyperFrames compositions — text-to-speech narration (Kokoro), audio/video transcription (Whisper), and background removal for transparent overlays (u2net... |
| influencer-marketing | Build an influencer marketing strategy — finding influencers, briefing, contracts, deliverables, performance tracking, micro vs macro strategy, outreach, and FTC compliance. Use... |
| marketingskills | 包含 47 个子 skill 的合集。 |
| meta-ads | Plan, build, and optimize Meta advertising campaigns on Facebook and Instagram — campaign structure, audience targeting (core, custom, lookalike), creative formats, pixel setup,... |
| omi | Omi3.0 小红书图文笔记生产线。输入内容素材 + IP形象，自动产出分镜脚本JSON + 图片生成指令，适用于 Claude Code、OpenClaw、Codex、扣子等任何具备本地图片生成能力的 Agent 平台。触发词：omi、小红书笔记生成、omi笔记 |
| pbakaus-arrange | Improve layout, spacing, and visual rhythm. Fixes monotonous grids, inconsistent spacing, and weak visual hierarchy to create intentional compositions. |
| pbakaus-typeset | Improve typography by fixing font choices, hierarchy, sizing, weight consistency, and readability. Makes text feel intentional and polished. |
| personal-brand | Build a personal brand strategy for founders, executives, creators, and consultants. Use when the user says "personal brand", "personal branding", "build my brand", "founder bra... |
| rebranding | Plan and execute a brand transformation — from diagnosis to new brand definition to rollout. Use when the user says "rebrand", "rebranding", "brand refresh", "update the brand",... |
| seedance-ad-creative | 详见该 skill 的 SKILL.md。 |
| target-audience | Define a brand's target audience with deep personas, psychographics, and ICP (Ideal Customer Profile). Use when the user says "target audience", "ideal customer", "customer pers... |
| technical-writer | Creates clear documentation, API references, guides, and technical content for developers and users. Use when: writing documentation, creating README files, documenting APIs, wr... |
| theme-factory | Toolkit for styling artifacts with a theme. These artifacts can be slides, docs, reportings, HTML landing pages, etc. There are 10 pre-set themes with colors/fonts that you can ... |
| ugc-strategy | Build a User Generated Content (UGC) strategy — getting customers to create content, review generation, UGC briefs for creators, social campaigns, contest mechanics, legal right... |
| whatsapp-marketing | Build a WhatsApp marketing strategy — WhatsApp Business setup, broadcast campaigns, automated flows, customer service, drip sequences, and conversational marketing. Use when the... |

## Root

| Skill | 用途 |
| --- | --- |
| find-skills | Helps users discover and install agent skills when they ask questions like "how do I do X", "find a skill for X", "is there a skill that can...", or express interest in extendin... |
