# MATLAB 技能包（共享）

## 安装位置
- **路径**: E:\MATLAB\
- **子目录**: anzhuang, anzhuangbao, jiaoben

## 基础概念
- MATLAB = Matrix Laboratory（矩阵实验室）
- 开发商: MathWorks
- 主要用途: 数据分析、深度学习、图像处理、信号处理、控制系统

## 核心功能
| 功能 | 说明 |
|------|------|
| 矩阵运算 | 基本数据单位是矩阵 |
| 数值计算 | 数值分析、线性代数 |
| 绘图 | 2D/3D数据可视化 |
| 算法开发 | 脚本和函数编写 |
| Simulink | 动态系统建模仿真 |

## 常用命令速查
```matlab
% 矩阵操作
A = [1 2 3; 4 5 6]    % 创建矩阵
A'                     % 矩阵转置
inv(A)                 % 矩阵求逆
det(A)                 % 行列式
size(A)                % 矩阵尺寸

% 绘图
plot(x, y)             % 2D折线图
scatter(x, y)          % 散点图
bar(x)                 % 柱状图
surf(X, Y, Z)          % 3D曲面图
xlabel('x轴')          % 轴标签
title('标题')          % 图标题

% 文件操作
load('data.mat')       % 加载数据
save('data.mat')       % 保存数据
csvread('data.csv')    % 读取CSV
csvwrite('data.csv', A) % 写入CSV

% 帮助
help function_name     % 查看帮助
doc function_name      % 详细文档
```

## 学习资源
- 菜鸟教程: https://www.cainiaojc.com/matlab/matlab-tutorial.html
- 官方文档: https://www.mathworks.com/help/matlab/

## 图像处理

### 图像读写与显示
```matlab
I = imread('image.jpg');
imshow(I);
imwrite(I, 'output.jpg');
imfinfo('image.jpg');
```

### 图像类型转换
```matlab
gray = rgb2gray(rgb);
bw = imbinarize(gray);          % 自动阈值
I_double = im2double(I);
```

### 图像增强
```matlab
J = imadjust(I);                % 自动调整
J = histeq(I);                  % 直方图均衡化
J = adapthisteq(I);             % 自适应直方图均衡
J = imgaussfilt(I, sigma);      % 高斯滤波
J = medfilt2(I);                % 中值滤波
```

### 边缘检测
```matlab
BW = edge(I, 'canny');          % Canny（最常用）
BW = edge(I, 'sobel');
BW = edge(I, 'prewitt');
BW = edge(I, 'log');            % Laplacian
```

### 形态学处理
```matlab
se = strel('disk', 5);
J = imerode(I, se);             % 腐蚀
J = imdilate(I, se);            % 膨胀
J = imopen(I, se);              % 开运算（去噪）
J = imclose(I, se);             % 闭运算（填孔）
J = bwareaopen(BW, 50);         % 去除小区域
```

### 图像分割
```matlab
level = graythresh(I);          % Otsu自动阈值
BW = imbinarize(I, level);
```

### 特征提取
```matlab
[BW, num] = bwlabel(BW);        % 标记连通区域
stats = regionprops(BW, 'all'); % 区域属性
corners = detectHarrisFeatures(I);
```

### 几何变换
```matlab
J = imresize(I, scale);         % 缩放
J = imrotate(I, angle);         % 旋转
J = imcrop(I, rect);            % 裁剪
```

### 实用技巧
```matlab
subplot(2,2,1); imshow(I1);     % 多图显示
J = imadd(I1, I2);              % 图像叠加
J = immultiply(I, scale);       % 乘法
```