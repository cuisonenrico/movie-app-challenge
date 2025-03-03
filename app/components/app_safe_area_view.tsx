import { SafeAreaView } from "react-native-safe-area-context";

const AppSafeAreaView = ({
  isDarkTheme,
  children,
}: {
  isDarkTheme: boolean;
  children: React.ReactNode;
}) => {
  var classStyle = isDarkTheme
    ? "flex-2 items-start justify-start gap-2 bg-black"
    : "flex-2 items-start justify-start gap-2 bg-white";
  return <SafeAreaView className={classStyle}>{children}</SafeAreaView>;
};

export default AppSafeAreaView;
