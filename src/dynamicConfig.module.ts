import { DynamicModule, Module } from "./@nestjs/common";

@Module({
  providers: [],
  exports: [],
})
export class DynamicConfigModule {
  static forRoot(options): DynamicModule | Promise<DynamicModule> {
    const providers = [
      {
        provide: "CONFIG",
        useValue: options,
      },
    ];
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          module: DynamicConfigModule,
          providers,
          exports: providers.map((provider) =>
            provider instanceof Function ? provider : provider.provide
          ),
        });
      }, 3000);
    });

    //   {
    //   module: DynamicConfigModule,
    //   providers,
    //   exports: providers.map((provider) =>
    //     provider instanceof Function ? provider : provider.provide
    //   ),
    // };
  }
}
