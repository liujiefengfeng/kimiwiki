
require 'erb'

class WikiContext
    def initialize(options)
        @wiki_title = options[:wiki_title] || "Just another wiki"
        @github_repo = options[:github_repo] || "kenpusney/wiki"

        @index_template = File.read("./.template/index.html.erb")
        @README_template = File.read("./.template/README.md.erb")
    end

    def render
        File.open("index.html") { |f|
            f.write ERB.new(@index_template).result(binding)
        }

        File.open("cnmd/README.cn.md") { |f|
            f.write ERB.new(@README_template).result(binding)
        }
    end
end

def cleanup
    FileUtils.rm_rf("cnmd/.", secure: true)
    FileUtils.rm("CNAME")
    FileUtils.rm("*.json")
end

def prompt(opts, key, hint)
    print(hint):
    val = gets.strip
    opts[key] = val.empty? ? nil : val
end

def initwiki
    cleanup
    opts = {}
    prompt(opts, :wiki_title, "Your wiki title:")
    prompt(opts, :github_repo, "Your repo [e.g. kenpusney/wiki]:")
    WikiContext.new(opts).render
end