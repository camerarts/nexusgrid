
export type Language = 'zh-CN' | 'en-US';

export const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
  { code: 'en-US', label: 'English', flag: '🇺🇸' },
];

export const translations = {
  'zh-CN': {
    title: 'Grid Splitter - 智能宫格切图工具',
    headerTitle: 'Grid Splitter',
    proStudio: 'Grid Studio',
    
    heroTitleStart: '创意',
    heroTitleEnd: '无限分格',
    heroSubtitle: '朋友圈九宫格配图神器',
    heroDesc: '专为社交媒体打造的在线切图工具。无论是三宫格、四宫格、六宫格还是九宫格，都能一键完美切割，让你的朋友圈与众不同。',
    freeService: '支持 3 / 4 / 6 / 9 等任意宫格布局，一键打包下载',
    
    themeDark: '简约黑',
    themeLight: '简约白',

    // Workflow
    step1: '上传图片',
    step2: '设置宫格',
    step3: '一键切图',

    ctaMain: '上传图片开始切图',
    ctaSub: '支持 JPG, PNG, WebP',

    uploadRelease: '释放以上传',
    uploadClick: '点击或拖拽图片上传',
    uploadSupport: '支持高分辨率原图，切图更清晰',
    hdOutput: '无损画质',
    
    processingTitle: '正在处理...',
    processingDesc: '正在生成切片预览...',
    
    // Features
    featRatio: '任意格数',
    featRatioDesc: '自定义行数与列数，支持3x1, 2x2, 3x3等任意布局。',
    featCompress: '智能排版',
    featCompressDesc: '支持调整边距、缩放与位置，所见即所得。',
    featPrivacy: '隐私安全',
    featPrivacyDesc: '所有处理均在浏览器本地完成，图片无需上传服务器。',
    
    footer: 'Grid Splitter Pro. Designed for fyt Camerart',
    
    // Grid Editor
    geTitle: '预览',
    geSelectAll: '全选',
    geReset: '重置',
    geReupload: '重新上传',
    geLayoutTitle: '网格布局',
    geCols: '列数',
    geRows: '行数',
    geTotalSlices: '切片总数',
    geAdjustTitle: '调整与裁剪',
    geResetAdjust: '重置调整',
    geScaleOverall: '整体缩放',
    geScaleX: '横向缩放',
    geScaleY: '纵向缩放',
    geDragHint: '提示：预览区支持滚轮缩放、拖拽移动',
    
    // Export Section
    geExportTitle: '文件命名与导出',
    gePrefixLabel: '增加前缀 (可选)',
    gePrefixPlaceholder: '例如: product_',
    geSuffixLabel: '增加后缀 (可选)',
    geSuffixPlaceholder: '例如: _v1',
    geFormatLabel: '导出格式',
    gePreviewLabel: '预览格式',
    geDownloadZip: '下载 ZIP 压缩包',
    
    alertError: '处理图片时出错，请重试。',
    alertType: '请上传图片文件',
    
    // Stats
    completed: '已完成',
    converted: '次转换',
  },
  'en-US': {
    title: 'Grid Splitter - Smart Grid Slicer',
    headerTitle: 'Grid Splitter',
    proStudio: 'Grid Studio',
    
    heroTitleStart: 'Creative',
    heroTitleEnd: 'Infinite Grids',
    heroSubtitle: 'The Ultimate Grid Maker for Social Media',
    heroDesc: 'Online grid slicing tool designed for social media. Create 3x1, 2x2, 3x3 grids instantly and make your profile stand out.',
    freeService: 'Supports 3 / 4 / 6 / 9 or any custom grid layout, download in one click',
    
    themeDark: 'Dark',
    themeLight: 'Light',

    step1: 'Upload',
    step2: 'Grid Layout',
    step3: 'Slice It',

    ctaMain: 'Upload to Slice',
    ctaSub: 'Supports JPG, PNG, WebP',

    uploadRelease: 'Release to Upload',
    uploadClick: 'Click or Drag Image',
    uploadSupport: 'High resolution supported for clearer slices',
    hdOutput: 'Lossless',
    
    processingTitle: 'Processing...',
    processingDesc: 'Generating grid preview...',
    
    featRatio: 'Custom Grids',
    featRatioDesc: 'Customize rows and columns. Supports 3x1, 2x2, 3x3 and more.',
    featCompress: 'Smart Layout',
    featCompressDesc: 'Adjust margins, scale, and position visually.',
    featPrivacy: 'Privacy Secure',
    featPrivacyDesc: 'All processing is done locally in the browser.',
    
    footer: 'Grid Splitter Pro. Designed for fyt Camerart',
    
    geTitle: 'Preview',
    geSelectAll: 'Select All',
    geReset: 'Reset',
    geReupload: 'Re-upload',
    geLayoutTitle: 'Grid Layout',
    geCols: 'Columns',
    geRows: 'Rows',
    geTotalSlices: 'Total Slices',
    geAdjustTitle: 'Adjust & Crop',
    geResetAdjust: 'Reset Adjust',
    geScaleOverall: 'Overall Scale',
    geScaleX: 'Horizontal Scale',
    geScaleY: 'Vertical Scale',
    geDragHint: 'Hint: Use wheel to zoom, drag to move',
    
    geExportTitle: 'File Naming & Export',
    gePrefixLabel: 'Add Prefix (Optional)',
    gePrefixPlaceholder: 'e.g. product_',
    geSuffixLabel: 'Add Suffix (Optional)',
    geSuffixPlaceholder: 'e.g. _v1',
    geFormatLabel: 'Export Format',
    gePreviewLabel: 'Preview Format',
    geDownloadZip: 'Download ZIP Archive',
    
    alertError: 'Error processing image, please try again.',
    alertType: 'Please upload an image file',
    
    // Stats
    completed: 'Completed',
    converted: 'Conversions',
  }
};
