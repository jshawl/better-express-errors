# Better Express Errors

## Installation


    npm install --save better-express-errors


```js
// after all other middleware and routes
app.use(require("better-express-errors")(app))
```

## What is it good for?

|Before|After|
| --- | --- |
|![](img/before/404.png)| ![](img/after/404.png) |
|![](img/before/type-error.png)| ![](img/after/type-error.png) |
|![](img/before/reference-error.png)| ![](img/after/reference-error.png) |
|![](img/before/render-engine-error.png)| ![](img/after/render-engine-error.png) |
|![](img/before/render-template-error.png)| ![](img/after/render-template-error.png) |
