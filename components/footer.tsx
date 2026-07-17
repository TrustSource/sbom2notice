"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useTranslation } from "react-i18next";
import Link from "next/link";

function ExternalIconLink({
                            href,
                            children,
                            "aria-label": ariaLabel
                          }: React.PropsWithChildren<{ href: string; "aria-label": string }>) {
  return (
    <Button asChild variant="ghost" size="icon" className="rounded-full">
      <a href={href} aria-label={ariaLabel} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </Button>
  );
}

export default function SiteFooter() {
  const year = new Date().getFullYear();
  const { t } = useTranslation("common");

  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION;

  return (
    <footer className="w-full border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{siteConfig.name}</span> - {t("app.name")}
              {appVersion && <span className="ml-2 text-xs text-muted-foreground/70">v{appVersion}</span>}
            </div>

            <div className="flex items-center gap-2">
              {siteConfig.links.github && (
                <ExternalIconLink href={siteConfig.links.github} aria-label={t("components.footer.aria.github")}>
                  <Github className="h-4 w-4" />
                </ExternalIconLink>
              )}
              {siteConfig.links.linkedin && (
                <ExternalIconLink href={siteConfig.links.linkedin} aria-label={t("components.footer.aria.linkedin")}>
                  <Linkedin className="h-4 w-4" />
                </ExternalIconLink>
              )}
              {siteConfig.links.email && (
                <ExternalIconLink href={siteConfig.links.email} aria-label={t("components.footer.aria.email")}>
                  <Mail className="h-4 w-4" />
                </ExternalIconLink>
              )}
            </div>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              {siteConfig.links.privacy && (
                <Link href={{ pathname: siteConfig.links.privacy }} className="text-muted-foreground hover:text-foreground">
                  {t("nav.privacy")}
                </Link>
              )}
              {siteConfig.links.terms && (
                <Link href={{ pathname: siteConfig.links.terms }} className="text-muted-foreground hover:text-foreground">
                  {t("nav.terms")}
                </Link>
              )}
              {siteConfig.links.imprint && (
                <Link href={{ pathname: siteConfig.links.imprint }} className="text-muted-foreground hover:text-foreground">
                  {t("nav.legalImprint")}
                </Link>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              {t("components.footer.copyright", { year, name: siteConfig.name })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
