const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "style.css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "bundle.js",
        path: path.join(__dirname, "build")
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: ["css-loader", "sass-loader"],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "images/"
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "fonts/"
                        }
                    }
                ]
            }
        ]
    },
    plugins: [extractSass]
};
