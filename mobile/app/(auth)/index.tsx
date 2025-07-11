import { Text, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons"
import { useSocialAuth } from "@/hooks/useSocialAuth";


export default function Index() {
  const {handleSocialAuth,isLoading} =useSocialAuth()
  return (
    <View className="flex-1  bg-white">
      <View className="flex-1 px-8 justify-between">

        <View className="flex-1 justify-center">
          {/* demo image */}
          <View className="items-center">
            <Image
              source={require("../../assets/images/afro.jpg")}
              className="size-96"
              resizeMode="contain"
            />

          </View>
          <View className="flex-col gap-2">
            {/* fro google  */}

            <TouchableOpacity className="flex-row items-center justify-center bg-white boder border-gray-300 rounded-full py-3 px-6"
              onPress={() => handleSocialAuth("oauth_google") }
              disabled={isLoading}
              style={{
                shadowColor:"#000",
                shadowOffset:{width:0,height:1},
                shadowOpacity:0.1,
                shadowRadius:2,
                elevation:2
              }}>

                {isLoading ? (
                <ActivityIndicator size="small" color="#000"/>
               ) : (
                <View className=" flex-row items-center justify-center">

                <Image
                  source={require("../../assets/images/google.png")}
                  className=" size-10 mr-3"
                  resizeMode="contain"

                />
                ,<Text className=" text-black font-medium text-base"> Continue with Google</Text>
              </View>
               )}


              {/* <View className=" flex-row items-center justify-center">

                <Image
                  source={require("../../assets/images/google.png")}
                  className=" size-10 mr-3"
                  resizeMode="contain"

                />
                ,<Text className=" text-black font-medium text-base"> Continue with Google</Text>
              </View> */}

            </TouchableOpacity>

            {/* for apple  */}

             <TouchableOpacity className="flex-row items-center justify-center bg-white boder border-gray-300 rounded-full py-3 px-6"
              onPress={() => handleSocialAuth("oauth_apple")}
              disabled={isLoading}
              style={{
                shadowColor:"#000",
                shadowOffset:{width:0,height:1},
                shadowOpacity:0.1,
                shadowRadius:2,
                elevation:2
              }}>
               

               {isLoading ? (
                <ActivityIndicator size="small" color="#000"/>
               ) : (
                <View className=" flex-row items-center justify-center">
               
                <Image
                  source={require("../../assets/images/apple.webp")}
                  className=" size-10 mr-3"
                  resizeMode="contain"

                />
                <Text className=" text-black font-medium text-base"> Continue with Apple</Text>
                
              </View>
               )}
               
              {/* <View className=" flex-row items-center justify-center">
               
                <Image
                  source={require("../../assets/images/apple.webp")}
                  className=" size-10 mr-3"
                  resizeMode="contain"

                />
                <Text className=" text-black font-medium text-base"> Continue with Apple</Text>
                
              </View> */}

            </TouchableOpacity>
             
                {/* end apple  */}
          </View>
             
             {/* terms and privacy */}
             <Text className=" text-center text-gray-500 text-xs leading-4 mt-6 px-2">
              By singing up you agree to our  <Text className=" text-blue-500">Terms</Text>{","}
              <Text className=" text-blue-500">Privacy Policy</Text>{"and"}
               <Text className=" text-blue-500">Cookies User</Text>
             </Text>
        </View>

      </View>
    </View>
  );
}

