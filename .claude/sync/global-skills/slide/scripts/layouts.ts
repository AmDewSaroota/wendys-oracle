/**
 * Layout generators — each returns an array of Google Slides API requests
 * for a single slide. All measurements in PT (points).
 *
 * Slide dimensions: 720pt x 405pt (default 16:9)
 */

import type { SlideSpec, ResolvedTheme, RGBColor, BulletItem } from "./types.js";

// Helpers
function rgbColor(c: RGBColor) {
  return { rgbColor: { red: c.red, green: c.green, blue: c.blue } };
}

function size(w: number, h: number) {
  return { width: { magnitude: w, unit: "PT" }, height: { magnitude: h, unit: "PT" } };
}

function transform(x: number, y: number, sx = 1, sy = 1) {
  return { scaleX: sx, scaleY: sy, translateX: x, translateY: y, unit: "PT" };
}

function textBox(id: string, pageId: string, x: number, y: number, w: number, h: number) {
  return {
    createShape: {
      objectId: id,
      shapeType: "TEXT_BOX",
      elementProperties: {
        pageObjectId: pageId,
        size: size(w, h),
        transform: transform(x, y),
      },
    },
  };
}

function insertText(id: string, text: string) {
  return { insertText: { objectId: id, insertionIndex: 0, text } };
}

function styleText(id: string, fontSize: number, color: RGBColor, bold = false, font = "Prompt") {
  return {
    updateTextStyle: {
      objectId: id,
      textRange: { type: "ALL" },
      style: {
        fontFamily: font,
        fontSize: { magnitude: fontSize, unit: "PT" },
        bold,
        foregroundColor: { opaqueColor: rgbColor(color) },
      },
      fields: "fontFamily,fontSize,bold,foregroundColor",
    },
  };
}

function bgRect(id: string, pageId: string, color: RGBColor) {
  return [
    {
      createShape: {
        objectId: id,
        shapeType: "RECTANGLE",
        elementProperties: {
          pageObjectId: pageId,
          size: size(720, 405),
          transform: transform(0, 0),
        },
      },
    },
    {
      updateShapeProperties: {
        objectId: id,
        shapeProperties: {
          shapeBackgroundFill: { solidFill: { color: rgbColor(color) } },
          outline: { propertyState: "NOT_RENDERED" },
        },
        fields: "shapeBackgroundFill.solidFill.color,outline",
      },
    },
  ];
}

function accentBar(id: string, pageId: string, color: RGBColor) {
  return [
    {
      createShape: {
        objectId: id,
        shapeType: "RECTANGLE",
        elementProperties: {
          pageObjectId: pageId,
          size: size(720, 6),
          transform: transform(0, 399),
        },
      },
    },
    {
      updateShapeProperties: {
        objectId: id,
        shapeProperties: {
          shapeBackgroundFill: { solidFill: { color: rgbColor(color) } },
          outline: { propertyState: "NOT_RENDERED" },
        },
        fields: "shapeBackgroundFill.solidFill.color,outline",
      },
    },
  ];
}

function bulletsToText(bullets: BulletItem[]): string {
  const lines: string[] = [];
  for (const b of bullets) {
    const prefix = b.icon ? `${b.icon} ` : "";
    lines.push(`${prefix}${b.text}`);
    if (b.sub) {
      for (const s of b.sub) lines.push(`    ${s}`);
    }
  }
  return lines.join("\n");
}

// ── Layout Generators ──

export function generateSlideRequests(
  slide: SlideSpec,
  index: number,
  theme: ResolvedTheme,
  font: string,
): any[] {
  const pageId = `slide_${index}`;
  const requests: any[] = [];

  // Create blank slide
  requests.push({
    createSlide: {
      objectId: pageId,
      insertionIndex: index,
      slideLayoutReference: { predefinedLayout: "BLANK" },
    },
  });

  // Background
  requests.push(...bgRect(`${pageId}_bg`, pageId, theme.background));

  // Accent bar at bottom
  requests.push(...accentBar(`${pageId}_bar`, pageId, theme.accent));

  // Layout-specific content
  switch (slide.layout) {
    case "title":
      requests.push(...titleLayout(slide, pageId, theme, font));
      break;
    case "content":
      requests.push(...contentLayout(slide, pageId, theme, font));
      break;
    case "two-column":
      requests.push(...twoColumnLayout(slide, pageId, theme, font));
      break;
    case "image-text":
      requests.push(...imageTextLayout(slide, pageId, theme, font));
      break;
    case "blank":
      requests.push(...blankLayout(slide, pageId, theme, font));
      break;
  }

  // Speaker notes
  const notes = "notes" in slide ? slide.notes : undefined;
  if (notes) {
    requests.push({
      insertText: {
        objectId: `${pageId}_notes`,
        text: notes,
      },
    });
  }

  return requests;
}

function titleLayout(slide: { title: string; subtitle?: string; icon?: string }, pageId: string, theme: ResolvedTheme, font: string) {
  const r: any[] = [];
  const titleText = slide.icon ? `${slide.icon}  ${slide.title}` : slide.title;

  // Title (centered, large)
  r.push(textBox(`${pageId}_title`, pageId, 60, 120, 600, 80));
  r.push(insertText(`${pageId}_title`, titleText));
  r.push(styleText(`${pageId}_title`, 36, theme.primary, true, font));
  r.push({
    updateParagraphStyle: {
      objectId: `${pageId}_title`,
      textRange: { type: "ALL" },
      style: { alignment: "CENTER" },
      fields: "alignment",
    },
  });

  // Subtitle
  if (slide.subtitle) {
    r.push(textBox(`${pageId}_sub`, pageId, 80, 210, 560, 50));
    r.push(insertText(`${pageId}_sub`, slide.subtitle));
    r.push(styleText(`${pageId}_sub`, 18, theme.muted, false, font));
    r.push({
      updateParagraphStyle: {
        objectId: `${pageId}_sub`,
        textRange: { type: "ALL" },
        style: { alignment: "CENTER" },
        fields: "alignment",
      },
    });
  }

  // Decorative line
  r.push({
    createShape: {
      objectId: `${pageId}_line`,
      shapeType: "RECTANGLE",
      elementProperties: {
        pageObjectId: pageId,
        size: size(120, 3),
        transform: transform(300, 200),
      },
    },
  });
  r.push({
    updateShapeProperties: {
      objectId: `${pageId}_line`,
      shapeProperties: {
        shapeBackgroundFill: { solidFill: { color: rgbColor(theme.accent) } },
        outline: { propertyState: "NOT_RENDERED" },
      },
      fields: "shapeBackgroundFill.solidFill.color,outline",
    },
  });

  return r;
}

function contentLayout(slide: { title: string; bullets: BulletItem[]; icon?: string }, pageId: string, theme: ResolvedTheme, font: string) {
  const r: any[] = [];
  const titleText = slide.icon ? `${slide.icon}  ${slide.title}` : slide.title;

  // Title bar background
  r.push({
    createShape: {
      objectId: `${pageId}_titlebar`,
      shapeType: "RECTANGLE",
      elementProperties: {
        pageObjectId: pageId,
        size: size(720, 60),
        transform: transform(0, 0),
      },
    },
  });
  r.push({
    updateShapeProperties: {
      objectId: `${pageId}_titlebar`,
      shapeProperties: {
        shapeBackgroundFill: { solidFill: { color: rgbColor(theme.primary) } },
        outline: { propertyState: "NOT_RENDERED" },
      },
      fields: "shapeBackgroundFill.solidFill.color,outline",
    },
  });

  // Title text (white on dark bar)
  const titleColor: RGBColor = { red: 1, green: 1, blue: 1 };
  r.push(textBox(`${pageId}_title`, pageId, 30, 12, 660, 40));
  r.push(insertText(`${pageId}_title`, titleText));
  r.push(styleText(`${pageId}_title`, 22, titleColor, true, font));

  // Bullet content
  const bodyText = bulletsToText(slide.bullets);
  r.push(textBox(`${pageId}_body`, pageId, 40, 80, 640, 300));
  r.push(insertText(`${pageId}_body`, bodyText));
  r.push(styleText(`${pageId}_body`, 14, theme.text, false, font));
  r.push({
    updateParagraphStyle: {
      objectId: `${pageId}_body`,
      textRange: { type: "ALL" },
      style: { spaceAbove: { magnitude: 6, unit: "PT" } },
      fields: "spaceAbove",
    },
  });

  return r;
}

function twoColumnLayout(slide: { title: string; left: { heading?: string; bullets: BulletItem[]; icon?: string }; right: { heading?: string; bullets: BulletItem[]; icon?: string } }, pageId: string, theme: ResolvedTheme, font: string) {
  const r: any[] = [];

  // Title bar
  r.push({
    createShape: {
      objectId: `${pageId}_titlebar`,
      shapeType: "RECTANGLE",
      elementProperties: { pageObjectId: pageId, size: size(720, 60), transform: transform(0, 0) },
    },
  });
  r.push({
    updateShapeProperties: {
      objectId: `${pageId}_titlebar`,
      shapeProperties: {
        shapeBackgroundFill: { solidFill: { color: rgbColor(theme.primary) } },
        outline: { propertyState: "NOT_RENDERED" },
      },
      fields: "shapeBackgroundFill.solidFill.color,outline",
    },
  });

  const titleColor: RGBColor = { red: 1, green: 1, blue: 1 };
  r.push(textBox(`${pageId}_title`, pageId, 30, 12, 660, 40));
  r.push(insertText(`${pageId}_title`, slide.title));
  r.push(styleText(`${pageId}_title`, 22, titleColor, true, font));

  // Left column
  const leftHeading = slide.left.icon
    ? `${slide.left.icon}  ${slide.left.heading || ""}`
    : slide.left.heading || "";
  if (leftHeading) {
    r.push(textBox(`${pageId}_lh`, pageId, 30, 75, 320, 30));
    r.push(insertText(`${pageId}_lh`, leftHeading));
    r.push(styleText(`${pageId}_lh`, 16, theme.secondary, true, font));
  }
  const leftBody = bulletsToText(slide.left.bullets);
  r.push(textBox(`${pageId}_lb`, pageId, 30, 110, 320, 270));
  r.push(insertText(`${pageId}_lb`, leftBody));
  r.push(styleText(`${pageId}_lb`, 12, theme.text, false, font));

  // Divider
  r.push({
    createShape: {
      objectId: `${pageId}_div`,
      shapeType: "RECTANGLE",
      elementProperties: { pageObjectId: pageId, size: size(2, 280), transform: transform(359, 75) },
    },
  });
  r.push({
    updateShapeProperties: {
      objectId: `${pageId}_div`,
      shapeProperties: {
        shapeBackgroundFill: { solidFill: { color: rgbColor(theme.muted) } },
        outline: { propertyState: "NOT_RENDERED" },
      },
      fields: "shapeBackgroundFill.solidFill.color,outline",
    },
  });

  // Right column
  const rightHeading = slide.right.icon
    ? `${slide.right.icon}  ${slide.right.heading || ""}`
    : slide.right.heading || "";
  if (rightHeading) {
    r.push(textBox(`${pageId}_rh`, pageId, 375, 75, 320, 30));
    r.push(insertText(`${pageId}_rh`, rightHeading));
    r.push(styleText(`${pageId}_rh`, 16, theme.secondary, true, font));
  }
  const rightBody = bulletsToText(slide.right.bullets);
  r.push(textBox(`${pageId}_rb`, pageId, 375, 110, 320, 270));
  r.push(insertText(`${pageId}_rb`, rightBody));
  r.push(styleText(`${pageId}_rb`, 12, theme.text, false, font));

  return r;
}

function imageTextLayout(slide: { title: string; imageUrl: string; imagePosition: "left" | "right"; text: string; bullets?: BulletItem[] }, pageId: string, theme: ResolvedTheme, font: string) {
  const r: any[] = [];

  // Title bar
  r.push({
    createShape: {
      objectId: `${pageId}_titlebar`,
      shapeType: "RECTANGLE",
      elementProperties: { pageObjectId: pageId, size: size(720, 60), transform: transform(0, 0) },
    },
  });
  r.push({
    updateShapeProperties: {
      objectId: `${pageId}_titlebar`,
      shapeProperties: {
        shapeBackgroundFill: { solidFill: { color: rgbColor(theme.primary) } },
        outline: { propertyState: "NOT_RENDERED" },
      },
      fields: "shapeBackgroundFill.solidFill.color,outline",
    },
  });

  const titleColor: RGBColor = { red: 1, green: 1, blue: 1 };
  r.push(textBox(`${pageId}_title`, pageId, 30, 12, 660, 40));
  r.push(insertText(`${pageId}_title`, slide.title));
  r.push(styleText(`${pageId}_title`, 22, titleColor, true, font));

  // Image
  const imgX = slide.imagePosition === "left" ? 30 : 380;
  const txtX = slide.imagePosition === "left" ? 380 : 30;

  r.push({
    createImage: {
      objectId: `${pageId}_img`,
      url: slide.imageUrl,
      elementProperties: {
        pageObjectId: pageId,
        size: size(310, 300),
        transform: transform(imgX, 75),
      },
    },
  });

  // Text content
  let bodyText = slide.text;
  if (slide.bullets) bodyText += "\n\n" + bulletsToText(slide.bullets);
  r.push(textBox(`${pageId}_body`, pageId, txtX, 75, 320, 300));
  r.push(insertText(`${pageId}_body`, bodyText));
  r.push(styleText(`${pageId}_body`, 13, theme.text, false, font));

  return r;
}

function blankLayout(slide: { content?: string; backgroundColor?: string }, pageId: string, theme: ResolvedTheme, font: string) {
  const r: any[] = [];

  if (slide.content) {
    r.push(textBox(`${pageId}_content`, pageId, 60, 140, 600, 120));
    r.push(insertText(`${pageId}_content`, slide.content));
    r.push(styleText(`${pageId}_content`, 28, theme.primary, true, font));
    r.push({
      updateParagraphStyle: {
        objectId: `${pageId}_content`,
        textRange: { type: "ALL" },
        style: { alignment: "CENTER" },
        fields: "alignment",
      },
    });
  }

  return r;
}
