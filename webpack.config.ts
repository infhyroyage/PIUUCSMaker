import path from "path";
import { Configuration } from "webpack";
import TerserPlugin from "terser-webpack-plugin";

const config: Configuration = {
  context: path.join(__dirname, "src"),
  entry: "./index.tsx",
  module: {
    rules: [
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
