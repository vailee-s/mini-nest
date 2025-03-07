import { DynamicModule, Module } from "./@nestjs/common";

@Module({
  providers: [],
  exports: [],
})
export class DynamicConfigModule {
  static forRoot(options): DynamicModule {
    const providers = [
      {
        provide: "CONFIG",
        useValue: options,
      },
    ];
    return {
      module: DynamicConfigModule,
      providers,
      exports: providers.map((provider) =>
        provider instanceof Function ? provider : provider.provide
      ),
    };
  }
}
