import path from "path";
import { Configuration } from "webpack";
import TerserPlugin from "terser-webpack-plugin";

const config: Configuration = {
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.(png|wav)$/,
        use: "file-loader",
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "public"),
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
};

export default config;
