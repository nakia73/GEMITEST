
import { Language } from './types';

export const translations: Record<Language, any> = {
  en: {
    wallDisplay: {
      title: "BANANA TWEEN",
      subtitle: "AI-Powered Animation Generator using Single-Image Reference. Transform static assets into motion using Gemini 2.5 Flash.",
      inputPhase: {
        title: "Input Phase",
        description: "The user uploads a SINGLE character sprite and describes the desired motion (e.g., 'The character smiles' or 'Hair blows in wind').",
        badge: "Input: [1 Image] + [Text Prompt]"
      },
      reasoningPhase: {
        title: "Motion Planner",
        description: "Gemini 2.5 Flash analyzes the character's features and breaks down the user's prompt into a frame-by-frame execution plan, calculating partial changes for each step.",
        logs: [
          "> Analyze character features...",
          "> Plan Frame 1: \"Mouth closed, corners lifting 20%...\"",
          "> Plan Frame 2: \"Mouth open slightly, eyes crinkle...\""
        ]
      },
      renderPhase: {
        title: "Reference Rendering",
        description: "Nano Banana (Gemini Flash Image) generates every frame by referencing the ORIGINAL source image + the specific progressive prompt to ensure character consistency.",
        frames: ["Frame 1", "Frame 2", "Frame 3"]
      },
      startButton: "Start Prototype",
      readyText: "Ready to animate your sprite? Click above to launch the tool."
    },
    tweenGenerator: {
      title: "BananaTween Prototype",
      apiKeyStatus: "API Key Status",
      backButton: "Back",
      keyframes: "Input Asset",
      startFrame: "Base Image",
      uploadStart: "Upload Character",
      motionPromptLabel: "Motion Prompt",
      motionPromptPlaceholder: "e.g., The character smiles gently\ne.g., The flame flickers intensely",
      settings: "Animation Settings",
      totalFrames: "Total Frames to Generate",
      generateButton: "Generate Animation",
      generating: "Animating...",
      filmStrip: "Animation Sequence",
      placeholderText: "Upload an image and describe the motion to generate frames.",
      livePreview: "Live Preview",
      waitingForFrames: "Waiting for frames...",
      fps: "FPS",
      frame: "Frame",
      debugInfo: "Debug Info",
      model1: "Planner",
      model2: "Renderer",
      statusPhase1: "Phase 1: Planning motion trajectory with Gemini 2.5 Flash...",
      statusPhase2: "Phase 2: Rendering {n} frames using Reference-Anchored Generation...",
      statusRendering: "Rendering frame {n}/{total}...",
      statusComplete: "Animation Complete!",
      statusError: "Error during generation. Check console."
    }
  },
  ja: {
    wallDisplay: {
      title: "バナナ・トゥイーン",
      subtitle: "1枚絵から動きを生み出すAIアニメーション生成ツール。Gemini 2.5 Flashが静止画に命を吹き込みます。",
      inputPhase: {
        title: "入力フェーズ",
        description: "ユーザーは「1枚のキャラクター画像」をアップロードし、させたい動きを言葉で指示します（例：「微笑む」「髪が風になびく」）。",
        badge: "入力: [画像1枚] + [モーション指示]"
      },
      reasoningPhase: {
        title: "モーション計画",
        description: "Gemini 2.5 Flashがキャラクターの特徴を分析。ユーザーの指示をコマごとの変化量に分解し、破綻のない段階的な演出プランを作成します。",
        logs: [
          "> キャラクター特徴分析中...",
          "> 計画 フレーム1: \"口は閉じ、口角が20%上がる...\"",
          "> 計画 フレーム2: \"口が少し開き、目が細まる...\""
        ]
      },
      renderPhase: {
        title: "参照レンダリング",
        description: "Nano Banana (Gemini Flash Image) が、常に「オリジナルの元画像」を参照しながら、計画された差分プロンプトを適用して各フレームを描画します。これにより絵柄のブレを防ぎます。",
        frames: ["フレーム 1", "フレーム 2", "フレーム 3"]
      },
      startButton: "プロトタイプを開始",
      readyText: "静止画を動かす準備はできましたか？上記をクリックしてツールを起動してください。"
    },
    tweenGenerator: {
      title: "BananaTween プロトタイプ",
      apiKeyStatus: "APIキー状態",
      backButton: "戻る",
      keyframes: "入力アセット",
      startFrame: "ベース画像",
      uploadStart: "画像をアップロード",
      motionPromptLabel: "モーションの指示",
      motionPromptPlaceholder: "例：この男性が優しく微笑む\n例：炎が激しく揺らめく",
      settings: "アニメーション設定",
      totalFrames: "生成フレーム数",
      generateButton: "アニメーション生成",
      generating: "生成中...",
      filmStrip: "アニメーションシーケンス",
      placeholderText: "画像をアップロードし、動きを指示して生成してください。",
      livePreview: "ライブプレビュー",
      waitingForFrames: "フレーム待機中...",
      fps: "FPS",
      frame: "フレーム",
      debugInfo: "デバッグ情報",
      model1: "プランナー",
      model2: "レンダラー",
      statusPhase1: "フェーズ 1: Gemini 2.5 Flashでモーションの軌跡を計画中...",
      statusPhase2: "フェーズ 2: リファレンス参照方式で {n} 枚のフレームを描画中...",
      statusRendering: "フレーム {n}/{total} をレンダリング中...",
      statusComplete: "生成完了！",
      statusError: "生成中にエラーが発生しました。コンソールを確認してください。"
    }
  }
};
