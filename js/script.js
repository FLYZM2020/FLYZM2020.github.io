// 等待DOM加载完成 - 确保HTML文档完全加载和解析后再执行JavaScript代码
// DOMContentLoaded事件监听器 - 确保HTML文档完全加载和解析后再执行JavaScript代码
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有图标项 - 使用querySelectorAll选择器获取页面上所有带有.icon-item类的元素
    const iconItems = document.querySelectorAll('.icon-item');
    
    // 存储每个图标的点击状态
    const clickStates = new Map();
    // 存储当前预览的图片信息
    let currentPreview = null;
    
    // 创建图片预览层的函数
    function createImagePreview(imgSrc) {
        // 创建预览容器
        const previewContainer = document.createElement('div');
        previewContainer.style.position = 'fixed';
        previewContainer.style.top = '0';
        previewContainer.style.left = '0';
        previewContainer.style.width = '100%';
        previewContainer.style.height = '100%';
        previewContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        previewContainer.style.display = 'flex';
        previewContainer.style.justifyContent = 'center';
        previewContainer.style.alignItems = 'center';
        previewContainer.style.zIndex = '9999';
        previewContainer.style.opacity = '0';
        // 平滑过渡
        previewContainer.style.transition = 'opacity 0.3s ease';
        
        // 创建预览图片
        const previewImg = document.createElement('img');
        previewImg.src = imgSrc;
        previewImg.style.maxWidth = '50%'; // 屏幕宽度的一半，这样面积就是四分之一
        previewImg.style.maxHeight = '50%'; // 屏幕高度的一半，这样面积就是四分之一
        previewImg.style.objectFit = 'contain';
        previewImg.style.transform = 'scale(0.8)';
        previewImg.style.transition = 'transform 0.3s ease';
        
        // 添加到容器
        previewContainer.appendChild(previewImg);
        document.body.appendChild(previewContainer);
        
        // 触发过渡效果
        setTimeout(() => {
            previewContainer.style.opacity = '1';
            previewImg.style.transform = 'scale(1)';
        }, 10);
        
        return { container: previewContainer, image: previewImg };
    }
    
    // 移除图片预览层的函数
    function removeImagePreview() {
        if (currentPreview) {
            currentPreview.container.style.opacity = '0';
            currentPreview.image.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                if (currentPreview.container.parentNode) {
                    document.body.removeChild(currentPreview.container);
                }
                currentPreview = null;
            }, 300);
        }
    }
    
    // 为每个图标项添加事件监听 - 使用forEach方法遍历所有获取到的图标元素
    iconItems.forEach(item => {
        // 初始化点击状态为false（未被放大）
        clickStates.set(item, false);
        
        // 鼠标悬停事件 - 为图标项添加mouseenter事件监听器，当鼠标悬停在图标上时触发
        item.addEventListener('mouseenter', function() {
            // 获取当前图标的背景玻璃矩形元素
            const glassBg = item.querySelector('.glass-bg');
            
            // 为背景玻璃矩形添加悬浮效果
            if (glassBg) {
                glassBg.style.boxShadow = '0 15px 45px rgba(0, 0, 0, 0.25)'; // 增强阴影效果
            }
        });
        
        // 鼠标离开事件 - 为图标项添加mouseleave事件监听器，当鼠标离开图标时触发
        item.addEventListener('mouseleave', function() {
            // 获取当前图标的背景玻璃矩形元素
            const glassBg = item.querySelector('.glass-bg');
            
            // 恢复背景玻璃矩形的原始效果
            if (glassBg) {
                glassBg.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)'; // 恢复原始阴影效果
            }
        });
        
        // 添加点击事件处理
        item.addEventListener('click', function(e) {
            // 获取父级<a>标签
            const parentLink = item.closest('a');
            
            // 检查当前图标的点击状态
            const isFirstClick = !clickStates.get(item);
            
            // 第一次点击 - 放大图片
            e.preventDefault(); // 阻止默认的链接跳转
            
            // 获取图片元素
            const img = item.querySelector('img');
            if (img) {
                // 创建图片预览
                currentPreview = createImagePreview(img.src);
                
                // 更新点击状态
                clickStates.set(item, true);
                
                // 为预览容器添加点击事件，点击预览区域以外的地方关闭预览
                currentPreview.container.addEventListener('click', function(e) {
                    if (e.target === currentPreview.container) {
                        removeImagePreview();
                        clickStates.set(item, false);
                    }
                });
                
                // 为预览图片添加点击事件，点击预览图片时跳转到对应的网页
                currentPreview.image.addEventListener('click', function() {
                    // 先移除预览
                    removeImagePreview();
                    
                    // 如果有父级<a>标签，在新标签页跳转到对应链接
                    if (parentLink && parentLink.href) {
                        window.open(parentLink.href, '_blank');
                    }
                    clickStates.set(item, false);
                });
            }
        });
        
        // 添加触摸事件支持（移动端）
        item.addEventListener('touchstart', function(e) {
            // 获取父级<a>标签
            const parentLink = item.closest('a');
            
            // 检查当前图标的点击状态
            const isFirstClick = !clickStates.get(item);
            
            // 第一次点击 - 放大图片
            e.preventDefault(); // 阻止默认的链接跳转
            
            // 获取图片元素
            const img = item.querySelector('img');
            if (img) {
                // 创建图片预览
                currentPreview = createImagePreview(img.src);
                
                // 更新点击状态
                clickStates.set(item, true);
                
                // 为预览容器添加触摸事件，点击预览区域以外的地方关闭预览
                currentPreview.container.addEventListener('touchstart', function(e) {
                    if (e.target === currentPreview.container) {
                        removeImagePreview();
                        clickStates.set(item, false);
                    }
                });
                
                // 为预览图片添加触摸事件，点击预览图片时跳转到对应的网页
                currentPreview.image.addEventListener('touchstart', function() {
                    // 先移除预览
                    removeImagePreview();
                    
                    // 如果有父级<a>标签，在新标签页跳转到对应链接
                    if (parentLink && parentLink.href) {
                        setTimeout(() => {
                            window.open(parentLink.href, '_blank');
                        }, 100); // 小延迟确保用户体验
                    }
                    clickStates.set(item, false);
                });
            }
        });
    });
});

// ——————————————————————————————————————————————————————————————————————————————————————————————————————————

// 定义Canvas动画相关变量和函数

// 获取文档根元素 - 用于后续获取滚动信息
const html = document.documentElement;
// 获取Canvas元素 - 通过ID选择器获取id为hero-lightpass的canvas元素
const canvas = document.getElementById("hero-lightpass");

// 获取Canvas 2D绘图上下文 - 用于在canvas上进行绘制操作
const context = canvas.getContext("2d");

// 总图片帧数 - 设置动画序列包含的总图片数量
const frameCount = 100;

// 当前正在显示的图片对象
let currentImage = null;

// 根据索引生成图片URL的函数
// 该函数接收一个索引值，返回对应的图片URL路径
const currentFrame = (index) => {
  // 返回格式化的图片URL - 使用模板字符串和padStart方法确保索引为2位数格式
  return `./jpg/2/${index.toString().padStart(3, "0")}.png`;
}
        
// 预加载图片函数
// 提前加载所有图片资源，优化用户体验，避免在滚动时出现图片加载延迟
const preloadImages = () => {
  // 遍历从1到frameCount的所有索引
  for (let i = 1; i <= frameCount; i++) {
    // 创建新的Image对象
    const img = new Image();
    // 设置图片源路径，触发预加载
    img.src = currentFrame(i);
  }
};

// 初始化和设置Canvas尺寸的函数
const setCanvasDimensions = () => {
  // 获取视口尺寸
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // 定义canvas的最大尺寸限制
  const maxWidth = 1158;
  const maxHeight = 770;
  
  // 计算缩放比例，确保canvas适应屏幕但不超过原始尺寸
  const scaleX = viewportWidth / maxWidth;
  const scaleY = viewportHeight / maxHeight;
  const scale = Math.min(1, scaleX, scaleY); // 不放大，只缩小
  
  // 设置canvas实际尺寸
  canvas.width = maxWidth * scale;
  canvas.height = maxHeight * scale;
  
  // 设置canvas显示尺寸（CSS）
  canvas.style.width = `${canvas.width}px`;
  canvas.style.height = `${canvas.height}px`;
};

// 调用初始化Canvas尺寸的函数
setCanvasDimensions();

// 初始化第一张图片
const loadInitialImage = () => {
  const img = new Image();
  img.src = currentFrame(1);
  img.onload = function() {
    // 先清除整个canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // 计算图片居中并按比例缩放
    const scale = Math.min(
      canvas.width / img.width,
      canvas.height / img.height
    );
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    
    // 计算居中坐标
    const centerX = (canvas.width - scaledWidth) / 2;
    const centerY = (canvas.height - scaledHeight) / 2;
    
    // 在canvas上居中绘制初始图片
    context.drawImage(img, centerX, centerY, scaledWidth, scaledHeight);
    currentImage = img;
  };
};

// 添加窗口大小变化事件监听，实现多端适配
window.addEventListener('resize', () => {
  // 重新设置canvas尺寸
  setCanvasDimensions();
  
  // 重新加载当前显示的图片，确保在新尺寸下正确显示
  const currentFrameIndex = Math.min(
    frameCount,
    Math.ceil((html.scrollTop / (html.scrollHeight - window.innerHeight)) * frameCount)
  );
  
  // 如果已经初始化过图片，重新加载当前帧
  if (currentImage) {
    updateImage(currentFrameIndex);
  } else {
    loadInitialImage();
  }
});

// 调用初始图片加载函数
loadInitialImage();

      // 更新Canvas显示的函数 - 核心动画函数，负责根据索引更新Canvas中显示的图片帧
      // 该函数在页面滚动时被调用，通过切换不同的图片帧实现平滑的视差或序列动画效果
      // 参数:
      //   index - 图片帧索引，用于确定当前应显示的图片
      const updateImage = (index) => {
        // 创建新的图片对象
        const newImage = new Image();
        
        // 图片加载完成后处理
        newImage.onload = function() {
          // 先清除整个canvas，确保显示下一张图片时隐藏上一张
          context.clearRect(0, 0, canvas.width, canvas.height);
          
          // 计算图片居中并按比例缩放
          const scale = Math.min(
            canvas.width / newImage.width,
            canvas.height / newImage.height
          );
          const scaledWidth = newImage.width * scale;
          const scaledHeight = newImage.height * scale;
          
          // 计算居中坐标
          const centerX = (canvas.width - scaledWidth) / 2;
          const centerY = (canvas.height - scaledHeight) / 2;
          
          // 在canvas上居中绘制新图片
          context.drawImage(newImage, centerX, centerY, scaledWidth, scaledHeight);
          
          // 更新当前图片引用
          currentImage = newImage;
        };
        
        // 设置图片源路径
        newImage.src = currentFrame(index);
      };

// 获取容器元素
const container = document.querySelector('.container');

// 添加窗口滚动事件监听器
// 当用户滚动页面时，根据滚动位置更新canvas上显示的图片
window.addEventListener("scroll", () => {
  // 获取当前页面滚动距离（从页面顶部到当前视口顶部的距离）
  const scrollTop = html.scrollTop;
  
  // 计算页面可滚动的最大距离
  // scrollHeight是整个文档的高度，window.innerHeight是当前视口的高度
  const maxScrollTop = html.scrollHeight - window.innerHeight;
  
  // 计算滚动比例（0-1之间的值）
  // 表示当前滚动位置相对于整个可滚动范围的比例
  const scrollFraction = scrollTop / maxScrollTop;
  
  // 根据滚动比例计算应该显示的图片索引
  // 使用Math.min确保索引不超过图片总数
  // 使用Math.ceil确保索引为整数
  const frameIndex = Math.min(
    frameCount,
    Math.ceil(scrollFraction * frameCount)
  );

  // 使用requestAnimationFrame确保平滑的动画效果
  // 索引为实际需要显示的图片索引（从1开始）
  requestAnimationFrame(() => updateImage(frameIndex));
  
  // 当图片循环完毕（滚动到最后一帧）时显示容器并隐藏canvas
  // 条件判断：当frameIndex等于最大帧数-1时，表示已经滚动到最后一帧
  if (frameIndex === frameCount - 1) {
    // 显示主内容容器：设置不透明度为1（完全可见），并将可见性设置为visible
    container.style.opacity = '1';
    container.style.visibility = 'visible';
    container.style.position = 'relative'; // 确保容器为相对定位，允许滚动
    
    // 隐藏canvas元素：设置不透明度为0（完全透明），并将可见性设置为hidden
    canvas.style.opacity = '0';
    canvas.style.visibility = 'hidden';
    
    // 查找并准备隐藏canvas的父容器
    // 使用document.querySelector获取class为'div-canvas'的元素，这是canvas的容器元素
    const divCanvas = document.querySelector('.div-canvas');
    if (divCanvas) {
      // 设置divCanvas容器的不透明度为0 - 使其完全透明
      divCanvas.style.opacity = '0';
      
      // 设置divCanvas容器的可见性为hidden - 使其完全隐藏且不占用页面布局空间
      divCanvas.style.visibility = 'hidden';
    }
    
    // 在canvas滑动结束后隐藏scroll-placeholder元素，使其不再占位
    const scrollPlaceholder = document.querySelector('.scroll-placeholder');
    if (scrollPlaceholder) {
      scrollPlaceholder.style.display = 'none'; // 完全移除元素在文档流中的占位
    }
    
    // 重置body样式以允许内容自然滚动，但保持背景固定
    document.body.style.height = 'auto'; // 重置body高度，允许内容自然滚动
    document.body.style.display = 'block'; // 重置display属性，允许正常文档流
    document.body.style.justifyContent = 'normal'; // 重置justify-content
    document.body.style.alignItems = 'normal'; // 重置align-items
    document.body.style.padding = '20px'; // 调整内边距
  }
  
});

// 调用预加载函数 - 在页面加载时预加载所有图片
// 这确保当用户开始滚动页面时，所有需要显示的图片已经加载完成，提供更流畅的用户体验
preloadImages();
