"use client";
import { redirect, useRouter } from "next/navigation";
import { useUser } from "@/providers/auth-context";
import { useState } from "react";
import { Input, InputProps } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { BuildinServices, PinPeriod, publishFormSchema } from "@/types";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import publish from "../actions/publish";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function Publish() {
  const { user, loading } = useUser();
  const { push } = useRouter();
  const [requesting, setRequesting] = useState(false);
  const form = useForm<z.infer<typeof publishFormSchema>>({
    resolver: zodResolver(publishFormSchema),
    defaultValues: {
      title: "",
      total_price: 0,
      total_slot: 0,
      occupied_slot: 0,
      region: "",
      allow_region: "",
      service: "",
      period: PinPeriod.MONTHLY,
    },
  });
  if (loading) return null;
  if (!user) {
    return redirect("/login");
  }
  const onSubmit = async (values: z.infer<typeof publishFormSchema>) => {
    try {
      setRequesting(true);
      await publish(values);
      push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setRequesting(false);
    }
  };
  return (
    <main className="w-full flex flex-col items-start space-y-2 h-full grow">
      <Form {...form}>
        <form
          className="m-0 p-0 w-full flex flex-col bg-background shadow-sm rounded-sm px-2 my-2 py-2 space-y-1 overflow-x-hidden"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>标题</FormLabel>
                <FormControl>
                  <InputWithIcon
                    icon="icon-[material-symbols--title]"
                    props={{ ...field }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>说明</FormLabel>
                <FormControl>
                  <Textarea placeholder="有什么需要说明的吗？" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="service"
            render={({ field }) => (
              <FormItem>
                <FormLabel>车型</FormLabel>
                <FormControl>
                  <ServiceInput props={{ ...field }} form={form} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>地区</FormLabel>
                <FormControl>
                  <InputWithIcon
                    icon="icon-[mdi--earth]"
                    props={{ ...field }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="total_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>总价</FormLabel>
                <FormControl>
                  <InputWithIcon
                    icon="icon-[ri--money-cny-circle-line]"
                    props={{
                      type: "number",
                      min: 1,
                      max: 10000,
                      ...field,
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>时长</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择拼车时长" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value={PinPeriod.MONTHLY}>一个月</SelectItem>
                      <SelectItem value={PinPeriod.QUARTERLY}>
                        一季度
                      </SelectItem>
                      <SelectItem value={PinPeriod.ANNUALLY}>一年</SelectItem>
                      <SelectItem value={PinPeriod.PERMANENT}>永久</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row justify-between gap-2">
            <div className="grow">
              <FormField
                control={form.control}
                name="occupied_slot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>已上车人数</FormLabel>
                    <FormControl>
                      <InputWithIcon
                        icon="icon-[ion--people-circle-outline]"
                        props={{ type: "number", max: 24, min: 1, ...field }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grow">
              <FormField
                control={form.control}
                name="total_slot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>总车位</FormLabel>
                    <FormControl>
                      <InputWithIcon
                        icon="icon-[mingcute--car-line]"
                        props={{ type: "number", max: 24, min: 1, ...field }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="allow_region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>限制节点</FormLabel>
                <FormControl>
                  <AllowRegionInput props={{ ...field }} form={form} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="telegram_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telegram链接</FormLabel>
                <FormControl>
                  <InputWithIcon
                    props={{ ...field, placeholder: "t.me/" }}
                    icon="icon-[line-md--telegram]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Upload
            form={form}
            setUploading={setRequesting}
            uploading={requesting}
          />

          <Button
            className="bg-themeGreen text-background rounded-md px-4 py-2  mb-2"
            type="submit"
            disabled={requesting}
          >
            发车
          </Button>
          {/* 
          <PublishButton
            data={data}
            className="bg-themeGreen text-primary-foreground rounded-md px-4 py-2  mb-2"
            pendingText=<Image
              src={truckPic}
              height={20}
              width={40}
              alt="发车中"
            />
          >
            发车
          </PublishButton> */}
        </form>
      </Form>
    </main>
  );
}

function AllowRegionInput({
  form,
  props = {},
}: {
  form: UseFormReturn<z.infer<typeof publishFormSchema>>;
  props?: InputProps & Partial<z.infer<typeof publishFormSchema>>;
}) {
  const [limit, setLimit] = useState(false);
  return (
    <div>
      <Switch
        onCheckedChange={(e) => {
          form.setValue("allow_region", "");
          setLimit(e);
        }}
      />
      {limit && <Input {...props} />}
    </div>
  );
}

function ServiceInput({
  form,
  props = {},
}: {
  form: UseFormReturn<z.infer<typeof publishFormSchema>>;
  props?: InputProps & Partial<z.infer<typeof publishFormSchema>>;
}) {
  const [customService, setCustomService] = useState(false);
  return (
    <div>
      <div className={`w-full ${customService ? "" : "hidden"}`}>
        <Input {...props} className="w-full" />
        <span
          className="text-sm text-muted-foreground underline cursor-pointer self-end"
          onClick={(e) => {
            e.preventDefault();
            setCustomService(false);
          }}
        >
          返回选择车型
        </span>
      </div>
      <div className={`w-full ${customService ? "hidden" : ""}`}>
        <Select
          onValueChange={(e) => {
            form.setValue("service", e);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="选择车型" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {Object.entries(BuildinServices).map((service) => (
              <SelectItem key={service[1]} value={service[1]}>
                {service[0]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span
          className="text-sm text-muted-foreground underline cursor-pointer end"
          onClick={(e) => {
            e.preventDefault();
            setCustomService(true);
          }}
        >
          不在这里? 自定义车型
        </span>
      </div>
    </div>
  );
}

function InputWithIcon({
  icon,
  props = {},
}: {
  icon: string;
  props?: InputProps & Partial<z.infer<typeof publishFormSchema>>;
}) {
  return (
    <>
      <div className="flex items-center relative">
        <Input className="pl-7" {...props} />
        <span
          className={cn("absolute left-1 h-5 w-5 text-secondary", `${icon}`)}
        />
      </div>
    </>
  );
}

function Upload({
  form,
  uploading,
  setUploading,
}: {
  form: UseFormReturn<z.infer<typeof publishFormSchema>>;
  uploading: boolean;
  setUploading: (state: boolean) => void;
}) {
  const uploadImage = async (file: File) => {
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const randomFileName = `public/${Math.random()
      .toString(36)
      .substring(5)}.${ext}`;
    return await supabase.storage.from("pinpin").upload(randomFileName, file);
  };
  const [message, setMessage] = useState("");
  return (
    <FormField
      name="allow_region"
      render={() => (
        <FormItem>
          <FormLabel>上传凭证（可选）</FormLabel>
          <FormControl>
            <>
              <Input
                accept=".jpg, .jpeg, .png"
                type="file"
                disabled={uploading}
                onChange={async (e) => {
                  if (
                    !e.currentTarget.files ||
                    e.currentTarget.files.length === 0
                  ) {
                    return;
                  }
                  const file = e.currentTarget.files[0];
                  try {
                    setUploading(true);
                    if (file.size > 1024 * 1024 * 2) {
                      e.currentTarget.value = "";
                      throw new Error("图片大小不能超过2MB");
                    }
                    const f = await uploadImage(file);
                    if (f.error) {
                      throw new Error(f.error.message);
                    }
                    form.setValue("images", [f.data.path]);
                    setMessage("");
                  } catch (e: any) {
                    setMessage(e.message || "上传失败");
                  } finally {
                    setUploading(false);
                  }
                }}
              />
              {message && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
            </>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
